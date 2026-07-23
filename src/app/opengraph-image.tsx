import { ImageResponse } from "next/og";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from "@/lib/constants";

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
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%)",
          color: "white",
          fontFamily: '"Noto Sans SC"',
          padding: 80,
        }}
      >
        {/* 装饰圆 */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.12)",
          }}
        />

        {/* 主标题 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 64 }}>🤖</span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              background: "linear-gradient(to right, #a5b4fc, #f9a8d4)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {APP_NAME}
          </span>
        </div>

        {/* 副标题 */}
        <p
          style={{
            fontSize: 36,
            color: "#c7d2fe",
            marginBottom: 0,
            fontWeight: 500,
          }}
        >
          {APP_TAGLINE}
        </p>

        {/* 描述 */}
        <p
          style={{
            fontSize: 22,
            color: "#94a3b8",
            marginTop: 20,
            maxWidth: 700,
            textAlign: "center",
          }}
        >
          {APP_DESCRIPTION}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans SC",
          data: fontData,
          style: "normal",
          weight: 900,
        },
        {
          name: "Noto Sans SC",
          data: fontData,
          style: "normal",
          weight: 500,
        },
        {
          name: "Noto Sans SC",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
