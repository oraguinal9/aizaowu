"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { formatRelativeTime } from "@/lib/utils";

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

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        💬 评论 ({comments.length})
      </h2>

      {error && (
        <div className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
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
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:opacity-50"
        />
        <button
          onClick={() => handleSubmit(null, newComment, () => setNewComment(""))}
          disabled={submitting || !newComment.trim() || !user}
          className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {submitting ? "发送中..." : "发表评论"}
        </button>
        {!user && (
          <span className="ml-3 text-sm text-gray-400">
            <a href="/login" className="text-blue-600 hover:underline">登录</a> 后参与评论
          </span>
        )}
      </div>

      {/* 评论列表 */}
      {loading ? (
        <p className="py-8 text-center text-sm text-gray-400">加载中...</p>
      ) : comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">暂无评论，来说两句吧</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {getEmail(comment)}
                </span>
                <span className="text-xs text-gray-400">
                  {formatRelativeTime(comment.created_at)}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {comment.body}
              </p>
              <button
                onClick={() => setReplyTo(replyTo?.id === comment.id ? null : { id: comment.id })}
                className="mt-2 text-xs text-gray-400 hover:text-blue-600"
              >
                {replyTo?.id === comment.id ? "取消回复" : "回复"}
              </button>

              {/* 回复输入框 */}
              {replyTo?.id === comment.id && (
                <div className="mt-2 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="写下回复..."
                    rows={2}
                    disabled={!user}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    onClick={() => handleSubmit(comment.id, replyText, () => { setReplyText(""); setReplyTo(null); })}
                    disabled={submitting || !replyText.trim() || !user}
                    className="mt-1 rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    回复
                  </button>
                </div>
              )}

              {/* 子回复 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 space-y-2 pl-6 border-l-2 border-gray-100 dark:border-gray-700">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {getEmail(reply)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(reply.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
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
