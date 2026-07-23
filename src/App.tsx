import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppShell } from "@/components/layout/AppShell";
import { Landing } from "@/pages/Landing";

// Lazy load pages for better performance
const Login = lazy(() => import("@/pages/Login").then((m) => ({ default: m.Login })));
const Register = lazy(() => import("@/pages/Register").then((m) => ({ default: m.Register })));
const Dashboard = lazy(() => import("@/pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const WorkspacePage = lazy(() => import("@/pages/WorkspacePage").then((m) => ({ default: m.WorkspacePage })));
const EditorPage = lazy(() => import("@/pages/EditorPage").then((m) => ({ default: m.EditorPage })));
const BotsPage = lazy(() => import("@/pages/BotsPage").then((m) => ({ default: m.BotsPage })));
const ChatPage = lazy(() => import("@/pages/ChatPage").then((m) => ({ default: m.ChatPage })));
const TerminalPage = lazy(() => import("@/pages/TerminalPage").then((m) => ({ default: m.TerminalPage })));
const MarketplacePage = lazy(() => import("@/pages/MarketplacePage").then((m) => ({ default: m.MarketplacePage })));
const IntegrationsPage = lazy(() => import("@/pages/IntegrationsPage").then((m) => ({ default: m.IntegrationsPage })));
const MCPPage = lazy(() => import("@/pages/MCPPage").then((m) => ({ default: m.MCPPage })));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage })));
const DeployPage = lazy(() => import("@/pages/DeployPage").then((m) => ({ default: m.DeployPage })));
const LogsPage = lazy(() => import("@/pages/LogsPage").then((m) => ({ default: m.LogsPage })));
const HistoryPage = lazy(() => import("@/pages/HistoryPage").then((m) => ({ default: m.HistoryPage })));
const LibraryPage = lazy(() => import("@/pages/LibraryPage").then((m) => ({ default: m.LibraryPage })));
const SettingsPage = lazy(() => import("@/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })));
const ProfilePage = lazy(() => import("@/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const FlowBuilderPage = lazy(() => import("@/pages/FlowBuilderPage").then((m) => ({ default: m.FlowBuilderPage })));
const AdminPage = lazy(() => import("@/pages/AdminPage").then((m) => ({ default: m.AdminPage })));
const PricingPage = lazy(() => import("@/pages/PricingPage").then((m) => ({ default: m.PricingPage })));

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={200}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
              <Route path="/register" element={<ErrorBoundary><Register /></ErrorBoundary>} />

              {/* Public Premium/Pricing */}
              <Route path="/pricing" element={<ErrorBoundary><PricingPage /></ErrorBoundary>} />

              {/* Protected Routes - Inside AppShell */}
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                <Route path="/workspaces" element={<ErrorBoundary><WorkspacePage /></ErrorBoundary>} />
                <Route path="/editor" element={<ErrorBoundary><EditorPage /></ErrorBoundary>} />
                <Route path="/editor/:projectId" element={<ErrorBoundary><EditorPage /></ErrorBoundary>} />
                <Route path="/bots" element={<ErrorBoundary><BotsPage /></ErrorBoundary>} />
                <Route path="/chat" element={<ErrorBoundary><ChatPage /></ErrorBoundary>} />
                <Route path="/terminal" element={<ErrorBoundary><TerminalPage /></ErrorBoundary>} />
                <Route path="/marketplace" element={<ErrorBoundary><MarketplacePage /></ErrorBoundary>} />
                <Route path="/integrations" element={<ErrorBoundary><IntegrationsPage /></ErrorBoundary>} />
                <Route path="/mcp" element={<ErrorBoundary><MCPPage /></ErrorBoundary>} />
                <Route path="/analytics" element={<ErrorBoundary><AnalyticsPage /></ErrorBoundary>} />
                <Route path="/deploy" element={<ErrorBoundary><DeployPage /></ErrorBoundary>} />
                <Route path="/logs" element={<ErrorBoundary><LogsPage /></ErrorBoundary>} />
                <Route path="/history" element={<ErrorBoundary><HistoryPage /></ErrorBoundary>} />
                <Route path="/library" element={<ErrorBoundary><LibraryPage /></ErrorBoundary>} />
                <Route path="/settings" element={<ErrorBoundary><SettingsPage /></ErrorBoundary>} />
                <Route path="/profile" element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
                <Route path="/flow" element={<ErrorBoundary><FlowBuilderPage /></ErrorBoundary>} />
                <Route path="/admin" element={<ErrorBoundary><AdminPage /></ErrorBoundary>} />
              </Route>

              {/* Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
