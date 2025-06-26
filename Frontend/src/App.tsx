import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Hub from "./pages/Hub";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreateHub from "./pages/CreateHub";
import HubAdmin from "./pages/HubAdmin";
import NotFound from "./pages/NotFound";
import CreatePostForm from "./components/CreatePostForm";
import JoinRequest from "./pages/JoinRequest";
import CreatePoll from "./pages/CreatePoll";
import AdminProtectedRoute from "./utils/AdminProtectedRoute";

// ✅ Add this component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  return token ? children : <SignIn />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* ✅ Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>}/>
          <Route path="/hub/:hubId" element={<ProtectedRoute><Hub /></ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
          <Route path="/create-hub" element={<ProtectedRoute><CreateHub /></ProtectedRoute>} />
          <Route path="/hub/:hubId/join-request" element={<ProtectedRoute><JoinRequest/></ProtectedRoute>} />
          <Route path="/hub/:hubId/admin" element={<AdminProtectedRoute><HubAdmin /></AdminProtectedRoute>} />
          <Route path="/hub/:hubId/create-post" element={<ProtectedRoute><CreatePostForm /></ProtectedRoute>} />
          <Route path="/hub/:hubId/create-poll" element={<ProtectedRoute><CreatePoll /></ProtectedRoute>} />

          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
