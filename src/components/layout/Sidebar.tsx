
import { NavLink } from "react-router-dom";
import { FileText, Users, Settings, BarChart4, Menu, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", path: "/", icon: <BarChart4 className="h-5 w-5" /> },
  { name: "Invoices", path: "/invoices", icon: <FileText className="h-5 w-5" /> },
  { name: "Employees", path: "/employees", icon: <Users className="h-5 w-5" /> },
  { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-10 shadow-md",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-primary-100 to-white">
        {!collapsed && (
          <span className="text-lg font-bold text-primary tracking-tight">InvoiceNexus</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-primary-50 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <Menu className="h-5 w-5 text-primary" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-primary" />
          )}
        </button>
      </div>
      <nav className="p-3">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-3 rounded-lg transition-all",
                    isActive
                      ? "bg-primary text-white shadow-md" 
                      : "text-gray-700 hover:bg-primary-50"
                  )
                }
              >
                <span className={cn("mr-3", collapsed && "mr-0")}>{item.icon}</span>
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
