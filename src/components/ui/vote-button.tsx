"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";

interface VoteButtonProps {
  projectId: string;
  initialVotes: number;
}

export function VoteButton({ projectId, initialVotes }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setVotes(initialVotes);
  }, [initialVotes]);

  // 检查投票状态
  useEffect(() => {
    checkVoteStatus();
  }, [projectId]);

  const checkVoteStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {};
    if (session?.access_token) {
      headers.authorization = `Bearer ${session.access_token}`;
    }
    const res = await fetch(`/api/votes?projectId=${projectId}`, { headers });
    const data = await res.json();
    if (data.success) setVoted(data.data.voted);
  };

  const handleVote = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setMessage(null);

    // Optimistic update
    const prevVotes = votes;
    const prevVoted = voted;
    setVoted(!voted);
    setVotes(voted ? votes - 1 : votes + 1);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers.authorization = `Bearer ${session.access_token}`;
      }

      const res = await fetch("/api/votes", {
        method: "POST",
        headers,
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json();

      if (data.success) {
        setVoted(data.data.voted);
        setVotes(data.data.voteCount);
      } else {
        // Rollback
        setVoted(prevVoted);
        setVotes(prevVotes);
        setMessage(data.error || "操作失败");
      }
    } catch {
      setVoted(prevVoted);
      setVotes(prevVotes);
      setMessage("网络错误");
    }
    setLoading(false);
  }, [loading, votes, voted, projectId]);

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleVote}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all ${
          voted
            ? "border-brand bg-brand/10 text-brand"
            : "border-border bg-surface text-foreground hover:border-brand/50 hover:text-brand"
        }`}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10 16.5a1 1 0 01-.78-.37C8.6 15.3 5 11.2 5 8.2A3.2 3.2 0 018.2 5c.8 0 1.45.3 1.8.78A2.3 2.3 0 0111.8 5 3.2 3.2 0 0115 8.2c0 3-3.6 7.1-4.22 7.93A1 1 0 0110 16.5z" />
        </svg>
        <span>{votes}</span>
      </button>
      <p className="text-xs text-muted">{voted ? "已投票" : "点赞支持"}</p>
      {message && <p className="text-xs text-red-500">{message}</p>}
    </div>
  );
}
