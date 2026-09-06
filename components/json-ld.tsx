/**
 * structured-data renderer — google reads these scripts for rich results
 * (logo, faq accordions, app info) on the search results page.
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      // escape "<" so no closing-tag injection is possible
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}