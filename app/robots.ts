import type { MetadataRoute } from "next";
import { isSitePublic } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isSitePublic()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
