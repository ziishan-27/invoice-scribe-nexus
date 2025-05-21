import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-4 md:p-6">
          <Outlet /> {/* This renders the matched child route */}
        </main>
      </div>
    </div>
  );
};
