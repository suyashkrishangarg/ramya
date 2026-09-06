import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const alt = "ramya ai — affordable hybrid ai agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** branded og card — dark canvas, brand mark, statement, domain */
export default async function Image() {
  const logoBuffer = await readFile(
    path.join(process.cwd(), "public", "ramya_logo_blackbg.png"),
  );
  const logoSrc = `data:image/png;base64,${Buffer.from(logoBuffer).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#060606",
          padding: "72px 84px",
        }}
      >
        <img
          src={logoSrc}
          width={132}
          height={132}
          alt="ramya ai"
          style={{ borderRadius: 22 }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 700,
            color: "#f4f4f3",
            letterSpacing: "-0.04em",
            marginTop: 44,
          }}
        >
          ramya ai
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 33,
            color: "#8f8f90",
            marginTop: 14,
          }}
        >
          ai that&apos;s affordable. without sacrifices.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#575758",
            marginTop: 34,
            letterSpacing: "0.15em",
          }}
        >
          ramyaai.tech
        </div>
      </div>
    ),
    { ...size },
  );
}