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
import Demo from "@/pages/Demo";
import Estimates from "@/pages/Estimates";
import Customers from "@/pages/Customers";
import PriceBooks from "@/pages/PriceBooks";
import Calculator from "@/pages/Calculator";
import Reports from "@/pages/Reports";
import Billing from "@/pages/Billing";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Guide from "@/pages/Guide";
import StepByStepGuides from "@/pages/StepByStepGuides";
import AI from "@/pages/AI";
import GHL from "@/pages/GHL";
import CoverPage from "@/pages/Cover";
import Scheduling from "@/pages/Scheduling";
import Reviews from "@/pages/Reviews";
import Team from "@/pages/Team";
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
      <Route path="/cover" element={<CoverPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/demo" element={<Demo />} />
      <Route 
        path="/" 
        element={
          user ? (
            <ProtectedRoute>
              <CoverPage />
            </ProtectedRoute>
          ) : (
            <LandingPage />
          )
        }
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/estimates"
        element={
          <ProtectedRoute>
            <Estimates />
          </ProtectedRoute>
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
        path="/customers" 
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/price-books" 
        element={
          <ProtectedRoute>
            <PriceBooks />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/calculator" 
        element={
          <ProtectedRoute>
            <Calculator />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/billing" 
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
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
      <Route 
        path="/guide" 
        element={
          <ProtectedRoute>
            <Guide />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/step-by-step" 
        element={
          <ProtectedRoute>
            <StepByStepGuides />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ai" 
        element={
          <ProtectedRoute>
            <AI />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ghl" 
        element={
          <ProtectedRoute>
            <GHL />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/scheduling" 
        element={
          <ProtectedRoute>
            <Scheduling />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reviews" 
        element={
          <ProtectedRoute>
            <Reviews />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/team" 
        element={
          <ProtectedRoute>
            <Team />
          </ProtectedRoute>
        } 
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};