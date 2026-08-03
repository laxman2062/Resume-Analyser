import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar />
      <main className="flex-1 px-10 py-8">{children}</main>
    </div>
  );
};