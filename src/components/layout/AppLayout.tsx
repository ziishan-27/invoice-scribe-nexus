
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 md:p-8 flex-1 overflow-auto">
          <Outlet /> {/* This renders the matched child route */}
        </main>
        <footer className="py-4 px-8 border-t border-gray-200 bg-white text-center text-gray-500 text-sm">
          <p>InvoiceNexus © {new Date().getFullYear()} - All Rights Reserved</p>
        </footer>
      </div>
    </div>
  );
};
