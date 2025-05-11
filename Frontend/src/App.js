"use client"

import { useState, useEffect } from "react"
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
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"

import { isAuthenticated } from "./services/auth"


import "./styles/App.css"
import Progress1 from "./pages/progress1/Progress1"
import EditLearningPlan from "./pages/EditLearningPlan/EditLearningPlan"
import AddLearningPlan from "./pages/AddLearningPlan/AddLearningPlan"
import Scheduling from "./pages/Scheduling/Scheduling"
import ViewAll from "./pages/ViewAll/ViewAll"



function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingPage />
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />

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
          
            <Route path="/learning_plan/edit/:id" element={<EditLearningPlan />} />
            <Route path="/learning_plan/add" element={<AddLearningPlan />} />
            {/* temporary to view the learning plans */}
            {/* <Route path="/learning_plan/viewAll" element={<ViewAll />} /> */}
            <Route path="/progress" element={<Progress1 />} />
      
 <Route
  path="/learning_plan/add"
  element={
    isAuthenticated() ? (
      <AddLearningPlan/>
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>
 <Route
  path="/learningPlan"
  element={
    isAuthenticated() ? (
      <Progress1/>
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>

            {/* <Route path="/scheduling" element={<Scheduling />} /> */}
            {/* temporary to view the learning plans */}
            {/* <Route path="/learning_plan/viewAll" element={<ViewAll />} /> */}
            <Route path="/progress" element={<Progress1 />} />
            {/* <Route path="/course" element={<Course />} /> */}
          <Route path="/" element={<Navigate to="/feed" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
