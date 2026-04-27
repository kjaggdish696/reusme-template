import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TemplatesPage from "./pages/TemplatesPage";
import EditorPage from "./pages/EditorPage";
import ProfilePage from "./pages/ProfilePage";
import SharePage from "./pages/SharePage";
import { AuthProvider } from "./store/AuthContext";
import { EditorProvider } from "./store/EditorContext";
import RequireAuth from "./components/common/RequireAuth";
import AppShell from "./components/common/AppShell";

export default function App() {
  return (
    <AuthProvider>
      <EditorProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <RequireAuth>
                <AppShell />
              </RequireAuth>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/editor/:resumeId" element={<EditorPage />} />
            {/* Share links require login to view */}
            <Route path="/share/:resumeId" element={<SharePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </EditorProvider>
    </AuthProvider>
  );
}
