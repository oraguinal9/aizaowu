"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { formatRelativeTime } from "@/lib/utils";
import { MessageSquare, Loader2 } from "lucide-react";

interface Comment {
  id: string;
  body: string;
  created_at: string;
  user_email?: { email: string } | null;
  replies?: Comment[];
}

interface Props {
  projectId: string;
}

export function CommentSection({ projectId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?projectId=${projectId}`);
    const data = await res.json();
    if (data.success) setComments(data.data);
    setLoading(false);
  };

  const handleSubmit = async (parentId: string | null, text: string, clearFn: () => void) => {
    if (!user) { setError("请先登录"); return; }
    setSubmitting(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ projectId, body: text, parentId }),
    });

    const data = await res.json();
    if (data.success) {
      clearFn();
      fetchComments();
    } else {
      setError(data.error || "评论失败");
    }
    setSubmitting(false);
  };

  const getEmail = (comment: Comment) => {
    if (comment.user_email && typeof comment.user_email === "object" && comment.user_email.email) {
      return comment.user_email.email.split("@")[0];
    }
    return "匿名用户";
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:opacity-50 transition-colors";

  return (
    <div>
      <h2 className="mb-4 inline-flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-foreground">
        <MessageSquare size={17} className="text-brand" />
        评论 ({comments.length})
      </h2>

      {error && (
        <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* 评论输入框 */}
      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "写下你的想法..." : "登录后参与评论"}
          rows={3}
          disabled={!user}
          className={inputClass}
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={() => handleSubmit(null, newComment, () => setNewComment(""))}
            disabled={submitting || !newComment.trim() || !user}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? "发送中..." : "发表评论"}
          </button>
          {!user && (
            <span className="text-sm text-muted">
              <a href="/login" className="text-brand hover:underline">登录</a> 后参与评论
            </span>
          )}
        </div>
      </div>

      {/* 评论列表 */}
      {loading ? (
        <p className="py-8 text-center text-sm text-muted">加载中...</p>
      ) : comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">暂无评论，来说两句吧</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-border bg-bg p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {getEmail(comment)}
                </span>
                <span className="text-xs text-muted">
                  {formatRelativeTime(comment.created_at)}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-foreground/80">
                {comment.body}
              </p>
              <button
                onClick={() => setReplyTo(replyTo?.id === comment.id ? null : { id: comment.id })}
                className="mt-2 text-xs text-muted transition-colors hover:text-brand"
              >
                {replyTo?.id === comment.id ? "取消回复" : "回复"}
              </button>

              {/* 回复输入框 */}
              {replyTo?.id === comment.id && (
                <div className="mt-2 border-l-2 border-border pl-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="写下回复..."
                    rows={2}
                    disabled={!user}
                    className={inputClass}
                  />
                  <button
                    onClick={() => handleSubmit(comment.id, replyText, () => { setReplyText(""); setReplyTo(null); })}
                    disabled={submitting || !replyText.trim() || !user}
                    className="mt-1 rounded-md bg-brand px-3 py-1 text-xs font-medium text-white transition hover:brightness-110 disabled:opacity-50"
                  >
                    回复
                  </button>
                </div>
              )}

              {/* 子回复 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 space-y-2 border-l-2 border-border pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="rounded-lg bg-surface p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {getEmail(reply)}
                        </span>
                        <span className="text-xs text-muted">
                          {formatRelativeTime(reply.created_at)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-foreground/70">
                        {reply.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
