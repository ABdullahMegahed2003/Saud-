import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://saudi-eta.vercel.app";
  const updatedAt = new Date();

  return [
    { url: baseUrl, lastModified: updatedAt, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/products`, lastModified: updatedAt, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: updatedAt, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/pre-order`, lastModified: updatedAt, changeFrequency: "monthly", priority: 0.8 },
  ];
}