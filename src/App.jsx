import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import RoleDetails from "./pages/RoleDetails";
import OrganizationDetails from "./pages/OrganizationDetails";
import PermissionDetails from "./pages/PermissionDetails";
import Settings from "./pages/Settings";
import NotificationDetails from "./pages/NotificationDetails";
import Boardview from "./pages/Boardview";
import { ToastProvider } from "./components/ui/toast";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <ToastProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/callback" element={<Callback />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/roles/:slug"
                    element={
                      <ProtectedRoute>
                        <RoleDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizations/:itemId"
                    element={
                      <ProtectedRoute>
                        <OrganizationDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/permissions/:name"
                    element={
                      <ProtectedRoute>
                        <PermissionDetails />
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
                    path="/notifications/:itemId"
                    element={
                      <ProtectedRoute>
                        <NotificationDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/boardview"
                    element={
                      <ProtectedRoute>
                        <Boardview />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </ToastProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
