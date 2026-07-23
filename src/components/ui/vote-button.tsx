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
    <div className="text-center">
      <button
        onClick={handleVote}
        disabled={loading}
        className={`inline-flex flex-col items-center gap-1 rounded-2xl px-8 py-4 text-2xl font-bold transition-all ${
          voted
            ? "bg-blue-100 text-blue-600 shadow-inner dark:bg-blue-900/40 dark:text-blue-400"
            : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
        }`}
      >
        <span>{voted ? "👍" : "👍"}</span>
        <span>{votes}</span>
      </button>
      {message && (
        <p className="mt-1 text-xs text-red-500">{message}</p>
      )}
      <p className="mt-1 text-xs text-gray-400">
        {voted ? "已投票" : "点赞支持"}
      </p>
    </div>
  );
}
