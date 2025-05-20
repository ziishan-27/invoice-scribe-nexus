
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMobileDetect } from "@/hooks/use-mobile";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const isMobile = useMobileDetect();
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
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:inline-block">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
