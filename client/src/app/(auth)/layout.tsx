/**
 * (auth) route group layout.
 * The AuthLayout component is used per-page (not here) so each page
 * can pass its own title/subtitle. This layout is a passthrough.
 */
export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
