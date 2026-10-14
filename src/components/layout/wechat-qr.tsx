"use client";

import { useState } from "react";
import { WECHAT_QR } from "@/lib/constants";

/** 微信二维码位：public/wechat-qr.png 就位后自动显示，否则显示占位 */
export default function WechatQr() {
  const [ok, setOk] = useState(true);

  return (
    <div className="qr-slot mx-auto grid h-44 w-44 place-items-center overflow-hidden text-center">
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={WECHAT_QR} alt="微信二维码" className="h-full w-full object-contain p-2" onError={() => setOk(false)} />
      ) : (
        <div className="px-4 text-xs leading-relaxed text-muted">
          微信二维码位
          <br />
          <span className="text-[10px] opacity-70">放置 public/wechat-qr.png 即显示</span>
        </div>
      )}
    </div>
  );
}
