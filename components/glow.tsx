/**
 * soft radial glow — pure css, server-renderable. position/size it with
 * tailwind utilities; the drift animation comes from globals.css.
 */
export function Glow({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`glow ${className}`} />;
}