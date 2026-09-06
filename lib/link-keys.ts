/** link slots editable from the admin console — rendered in the footer when set.
 *  client-safe: no database imports (shared by lib/settings.ts and the admin UI). */
export const KNOWN_LINKS: { key: string; label: string }[] = [
  { key: "github_url", label: "github" },
  { key: "twitter_url", label: "x / twitter" },
  { key: "linkedin_url", label: "linkedin" },
  { key: "youtube_url", label: "youtube" },
  { key: "discord_url", label: "discord" },
  { key: "demo_video_url", label: "demo video" },
  { key: "docs_url", label: "docs" },
];
