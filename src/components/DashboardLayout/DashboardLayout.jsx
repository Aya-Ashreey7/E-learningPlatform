import NavbarDash from "../NavBarDash/NavbarDash";
import SidebarDash from "../SidebarDash/sidebarDash";

export default function DashboardLayout({ children }) {
  return (
    <>
      <div>
        <SidebarDash />
        <div className="ml-64">
          <NavbarDash />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </>
  );
}
