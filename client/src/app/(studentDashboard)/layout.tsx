/**
 * (studentDashboard) route group layout.
 * Provides a consistent wrapper for all student-facing dashboard pages.
 */
export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="student-dashboard-group">
      {children}
    </div>
  );
}
