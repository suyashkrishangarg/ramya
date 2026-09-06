import type { MetadataRoute } from "next";

/** pwa-style site manifest — reinforces brand name + icon for search surfaces */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ramya ai",
    short_name: "ramya",
    description:
      "the universal hybrid agent platform — routine ai work runs free and private on your hardware, deep reasoning escalates to cost-optimized cloud models.",
    start_url: "/",
    display: "standalone",
    background_color: "#060606",
    theme_color: "#060606",
    icons: [
      {
        src: "/ramya_logo_blackbg.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}