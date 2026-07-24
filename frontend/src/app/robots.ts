import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/projects/", "/diagnostic", "/security", "/contact"],
      disallow: ["/admin", "/api/"],
    },
  };
}
