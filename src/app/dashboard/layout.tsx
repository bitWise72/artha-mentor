import Navbar from "@/components/Navbar";
import MascotTutor from "@/components/MascotTutor";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "60px" }}>
        {children}
      </div>
      <MascotTutor />
    </>
  );
}
