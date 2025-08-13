
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import { HomePage } from "@/components/HomePage";
import { ProcurementPage } from "@/components/ProcurementPage";
import { InventoryPage } from "@/components/InventoryPage";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";
import { Footer } from "@/components/Footer";

const queryClient = new QueryClient();

const Index = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check for persistent admin login on app load
  useEffect(() => {
    const adminLoginStatus = localStorage.getItem('adminLoggedIn');
    if (adminLoginStatus === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminData');
    setIsAdminLoggedIn(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <Header 
          isAdminLoggedIn={isAdminLoggedIn} 
          onAdminLogout={handleAdminLogout}
        />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/procurement" element={<ProcurementPage />} />
            <Route 
              path="/inventory" 
              element={<InventoryPage isAdminLoggedIn={isAdminLoggedIn} />} 
            />
            <Route 
              path="/admin" 
              element={
                isAdminLoggedIn ? (
                  <AdminDashboard />
                ) : (
                  <AdminLogin onLogin={handleAdminLogin} />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
};

export default Index;
