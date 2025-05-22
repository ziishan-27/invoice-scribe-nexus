
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogOut, Menu, X, Plus, UserPlus, FileText, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          {isMobile && (
            <Button
              variant="ghost"
              className="mr-2"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          )}
          <Link to="/" className="flex items-center">
            <div className="bg-primary text-white p-2 rounded-lg shadow-md mr-2">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
              InvoiceNexus
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          {user && (
            <>
              <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:text-primary hover:bg-primary-50">
                <Bell className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="shadow-sm bg-white hover:bg-primary-50">
                    <Plus className="h-4 w-4 mr-1 text-primary" />
                    <span>Create New</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200 rounded-lg w-56">
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary-50 focus:bg-primary-50">
                    <Link to="/employees/new" className="flex items-center py-2">
                      <UserPlus className="h-4 w-4 mr-2 text-blue-500" />
                      New Employee
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary-50 focus:bg-primary-50">
                    <Link to="/invoices/new" className="flex items-center py-2">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      New Invoice
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary font-medium">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.email}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
