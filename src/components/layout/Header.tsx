
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogOut, Menu, X, Plus, UserPlus, FileText } from "lucide-react";
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
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="flex items-center justify-between h-16 px-4">
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
            <span className="text-xl font-bold text-primary">InvoiceNexus</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          {user && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    <span>Create New</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem asChild>
                    <Link to="/employees/new" className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-2" />
                      New Employee
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/invoices/new" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      New Invoice
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden md:inline-block">
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={signOut}>
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
