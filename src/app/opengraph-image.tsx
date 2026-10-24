import { ImageResponse } from "next/og";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export const runtime = "edge";
export const alt = APP_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // 加载支持中文的字体
  const fontData = await fetch(
    "https://fonts.gstatic.com/s/notosanssc/v36/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG-3FnYxNbPzS5HE.ttf"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "linear-gradient(160deg, #0a0a0f 0%, #14141d 55%, #0a0a0f 100%)",
          color: "#f4f4f5",
          fontFamily: '"Noto Sans SC"',
          padding: 80,
          position: "relative",
        }}
      >
        {/* 品牌辉光 */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,154,255,0.28) 0%, rgba(139,154,255,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: -100,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.16) 0%, rgba(34,211,238,0) 70%)",
          }}
        />

        {/* 顶部：标识 + 眉标 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              border: "1px solid rgba(139,154,255,0.35)",
              background: "rgba(139,154,255,0.10)",
              color: "#8b9aff",
              fontSize: 30,
              fontWeight: 900,
            }}
          >
            造
          </div>
          <span
            style={{
              fontSize: 22,
              letterSpacing: "0.28em",
              color: "#9a9aa8",
              fontWeight: 500,
            }}
          >
            AI ZAOWU · 个人 AI 工作室
          </span>
        </div>

        {/* 中部：主标题 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              background: "linear-gradient(120deg, #8b9aff 0%, #a78bfa 60%, #22d3ee 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {APP_NAME}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 40,
              fontWeight: 500,
              color: "#e4e4e7",
              lineHeight: 1.3,
            }}
          >
            {APP_TAGLINE}
          </div>
        </div>

        {/* 底部：域名单行 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <span style={{ fontSize: 24, color: "#8b9aff", fontWeight: 700 }}>aizaow.com</span>
          <span style={{ fontSize: 24, color: "#71717a" }}>
            {" "}
            · 53 个上线作品，现场可点开
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Noto Sans SC", data: fontData, style: "normal", weight: 900 },
        { name: "Noto Sans SC", data: fontData, style: "normal", weight: 700 },
        { name: "Noto Sans SC", data: fontData, style: "normal", weight: 500 },
      ],
    }
  );
}
