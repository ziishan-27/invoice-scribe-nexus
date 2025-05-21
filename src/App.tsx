import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AuthProvider } from "./hooks/useAuth";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { InvoicesList } from "./pages/invoices/InvoicesList";
import { InvoiceDetail } from "./pages/invoices/InvoiceDetail";
import { EmployeesList } from "./pages/employees/EmployeesList";
import { EmployeeDetail } from "./pages/employees/EmployeeDetail";
import { NewEmployee } from "./pages/employees/NewEmployee";
import { Settings } from "./pages/Settings";
import { Auth } from "./pages/Auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="invoices" element={<InvoicesList />} />
                <Route path="invoices/new" element={<InvoiceDetail />} />
                <Route path="invoices/:id" element={<InvoiceDetail />} />
                <Route path="employees" element={<EmployeesList />} />
                <Route path="employees/new" element={<NewEmployee />} />
                <Route path="employees/:id" element={<EmployeeDetail />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
