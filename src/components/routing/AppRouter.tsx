import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import EstimateBuilder from "@/pages/EstimateBuilder";
import CustomerPortal from "@/pages/CustomerPortal";
import Jobs from "@/pages/Jobs";
import TechMobile from "@/pages/TechMobile";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const AppRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route 
        path="/" 
        element={
          user ? (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ) : (
            <LandingPage />
          )
        } 
      />
      <Route 
        path="/estimates/new" 
        element={
          <ProtectedRoute>
            <EstimateBuilder />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/jobs" 
        element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mobile" 
        element={
          <ProtectedRoute>
            <TechMobile />
          </ProtectedRoute>
        } 
      />
      <Route path="/portal/:estimateId" element={<CustomerPortal />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};