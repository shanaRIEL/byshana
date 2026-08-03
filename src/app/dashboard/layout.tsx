import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 py-10 px-12 max-[900px]:px-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
