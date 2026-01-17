export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://itspremdev.vercel.app/sitemap.xml",
  };
}
