import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "V Fitness Dubai",
    short_name: "V Fitness",
    description: "Gym in International City, Dubai — strength, CrossFit, HIIT and personal training.",
    start_url: "/",
    display: "standalone",
    background_color: "#02060c",
    theme_color: "#22d3ee",
    icons: [{ src: "/icon.png", sizes: "64x64", type: "image/png" }, { src: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  };
}
