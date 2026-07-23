-- AI造物 数据库 Schema
-- Supabase PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. 分类
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT '📦',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 项目
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    screenshots TEXT[] DEFAULT '{}',
    thumbnail_url TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
    vote_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    submitter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    featured_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    published_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_proj_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_proj_cat ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_proj_pub ON projects(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_proj_votes ON projects(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_proj_tags ON projects USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_proj_trgm ON projects USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_proj_feat ON projects(is_featured) WHERE is_featured = TRUE;

-- 3. 投票（混合模式）
CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address TEXT,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_vote_user_proj UNIQUE (user_id, project_id),
    CONSTRAINT uq_vote_ip_proj UNIQUE (ip_address, project_id),
    CONSTRAINT chk_vote_id CHECK (user_id IS NOT NULL OR ip_address IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_votes_proj ON votes(project_id);
CREATE INDEX IF NOT EXISTS idx_votes_time ON votes(created_at DESC);

-- 投票计数触发器
CREATE OR REPLACE FUNCTION update_project_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE projects SET vote_count = vote_count + 1 WHERE id = NEW.project_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE projects SET vote_count = GREATEST(vote_count - 1, 0) WHERE id = OLD.project_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trigger_vote_count ON votes;
CREATE TRIGGER trigger_vote_count AFTER INSERT OR DELETE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_project_vote_count();

-- 4. 匿名投票日限额
CREATE TABLE IF NOT EXISTS ip_votes_daily (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT NOT NULL,
    vote_date DATE NOT NULL DEFAULT CURRENT_DATE,
    count INT NOT NULL DEFAULT 1,
    UNIQUE(ip_address, vote_date)
);

-- 5. 评论
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_comments_proj ON comments(project_id, created_at ASC);

-- 评论计数触发器
CREATE OR REPLACE FUNCTION update_project_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.is_hidden = FALSE THEN
        UPDATE projects SET comment_count = comment_count + 1 WHERE id = NEW.project_id;
    ELSIF TG_OP = 'DELETE' AND OLD.is_hidden = FALSE THEN
        UPDATE projects SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.project_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trigger_comment_count ON comments;
CREATE TRIGGER trigger_comment_count AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_project_comment_count();

-- 6. 限流日志
CREATE TABLE IF NOT EXISTS rate_limit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rate_limit ON rate_limit_log(ip_address, endpoint, created_at DESC);

-- 浏览量增加函数
CREATE OR REPLACE FUNCTION increment_view(project_slug TEXT)
RETURNS void AS $$
BEGIN
    UPDATE projects SET view_count = view_count + 1 WHERE slug = project_slug;
END;
$$ LANGUAGE plpgsql;

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_votes_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cat_read" ON categories;
CREATE POLICY "cat_read" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "proj_read" ON projects;
CREATE POLICY "proj_read" ON projects FOR SELECT
    USING (status = 'published' OR auth.uid() = submitter_id);

DROP POLICY IF EXISTS "proj_insert" ON projects;
CREATE POLICY "proj_insert" ON projects FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = submitter_id);

DROP POLICY IF EXISTS "votes_read" ON votes;
CREATE POLICY "votes_read" ON votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "votes_insert" ON votes;
CREATE POLICY "votes_insert" ON votes FOR INSERT WITH CHECK (
    (auth.uid() = user_id AND user_id IS NOT NULL)
    OR (ip_address IS NOT NULL AND user_id IS NULL)
);

DROP POLICY IF EXISTS "comments_read" ON comments;
CREATE POLICY "comments_read" ON comments FOR SELECT USING (is_hidden = FALSE);

DROP POLICY IF EXISTS "comments_insert" ON comments;
CREATE POLICY "comments_insert" ON comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);
