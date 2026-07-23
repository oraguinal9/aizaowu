import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION, APP_URL } from "@/lib/constants";

const OG_IMAGE = `${APP_URL}/opengraph-image`;

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ["AI项目", "AI工具", "AI应用", "AI创造", "素人开发者", "AI编程", "项目展示", "AI造物"],
  alternates: { canonical: APP_URL },
  verification: { other: { "baidu-site-verification": "codeva-aREaMJQuiN" } },
  openGraph: {
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    type: "website",
    locale: "zh_CN",
    siteName: APP_NAME,
    url: APP_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: APP_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        {/* 全站结构化数据 */}
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: APP_NAME,
            url: APP_URL,
            description: APP_DESCRIPTION,
            potentialAction: {
              "@type": "SearchAction",
              target: { "@type": "EntryPoint", urlTemplate: `${APP_URL}/search?q={search_term_string}` },
              "query-input": "required name=search_term_string",
            },
          })}} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: APP_NAME,
            url: APP_URL,
            description: APP_DESCRIPTION,
            logo: `${APP_URL}/opengraph-image`,
          })}} />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        {/* 百度自动推送 */}
        <Script id="baidu-push" strategy="afterInteractive">
          {`(function(){var bp=document.createElement('script');var curProtocol=window.location.protocol.split(':')[0];if(curProtocol==='https'){bp.src='https://zz.bdstatic.com/linksubmit/push.js'}else{bp.src='http://push.zhanzhang.baidu.com/push.js'}var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(bp,s)})();`}
        </Script>
        {/* 百度统计 */}
        <Script id="baidu-tongji" strategy="afterInteractive">{`var _hmt=_hmt||[];(function(){var hm=document.createElement('script');hm.src='https://hm.baidu.com/hm.js?b1e8f3f0b8f169210a59fafa8fdc6ca2';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(hm,s)})();`}</Script>
      </body>
    </html>
  );
}
