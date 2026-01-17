export default async function sitemap() {
  const baseUrl = "https://itspremdev.vercel.app";

  const staticRoutes = [
    "",
    "/about",
    "/projects",
    "/skills",
    "/blogs",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutes];
}
