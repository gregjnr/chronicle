import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { WhiteMotionGraphics } from './components/WhiteMotionGraphics.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { PostDetailPage } from './pages/PostDetailPage.js';
import { CreatePostPage } from './pages/CreatePostPage.js';
import { EditPostPage } from './pages/EditPostPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-black selection:bg-white selection:text-black">
          {/* Animated White Motion Graphics on Background */}
          <WhiteMotionGraphics />

          {/* Sticky Glass Navbar */}
          <Navbar />

          {/* Main App Content Container */}
          <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/post/:id" element={<PostDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Author Routes */}
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreatePostPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditPostPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Glass Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
