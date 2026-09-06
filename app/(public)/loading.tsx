import { PageSkeleton } from "@/components/skeletons";

/** route-transition skeleton — shown while a public page streams in.
 *  deliberately scoped to the (public) group: /profile and /signup must
 *  stay boundary-free so their auth redirects emit real 307s. */
export default function Loading() {
  return <PageSkeleton />;
}
