"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/analytics/attribution";
import { trackPageView } from "@/lib/analytics/track";

export function Analytics({ ymId }: { ymId: string | null }) {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
    trackPageView(pathname);
  }, [pathname]);

  if (!ymId) return null;

  const bootstrap = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${ymId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false});`;

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {bootstrap}
    </Script>
  );
}
