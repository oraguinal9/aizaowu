"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { QQ_NUMBER } from "@/lib/constants";

/** QQ 号一键复制 */
export default function QqCopy() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(QQ_NUMBER);
    } catch {
      // 降级：老浏览器用 execCommand
      const ta = document.createElement("textarea");
      ta.value = QQ_NUMBER;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="group inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-1.5 font-mono text-sm text-brand transition hover:border-border-strong"
      aria-label={`复制 QQ 号 ${QQ_NUMBER}`}
    >
      <span>QQ {QQ_NUMBER}</span>
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="opacity-60 transition group-hover:opacity-100" />}
      {copied && <span className="text-xs text-muted">已复制</span>}
    </button>
  );
}
