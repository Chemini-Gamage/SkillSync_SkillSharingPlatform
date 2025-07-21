import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import LoadingPage from "./components/LoadingPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ProfilePage from "./pages/ProfilePage"
import ProfileEditPage from "./pages/ProfileEditPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import EmailVerificationPage from "./pages/EmailVerificationPage"
import FeedPage from "./pages/FeedPage"

import AddLearningPlan from "./pages/LearningPlans/AddLearningPlan/AddLearningPlan"
import EditLearningPlan from "./pages/LearningPlans/EditLearningPlan/EditLearningPlan"
import Progress1 from "./pages/LearningPlans/progress1/Progress1"
import ViewAllLearningPlans from "./pages/LearningPlans/ViewAll/ViewAll"


import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"

import "./styles/App.css"

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingPage />

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />

          {/* Protected Routes */}
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <FeedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <ProfileEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
     
        
          <Route
            path="/learningPlans/add"
            element={
              <ProtectedRoute>
                <AddLearningPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learningPlans/edit/:id"
            element={
              <ProtectedRoute>
                <EditLearningPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learningPlans/all"
            element={
              <ProtectedRoute>
                <ViewAllLearningPlans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learningPlans/progress"
            element={
              <ProtectedRoute>
                <Progress1 />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
