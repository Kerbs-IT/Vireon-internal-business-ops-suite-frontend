import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LoginPage from './pages/Login'
import { Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import { Layout } from './Layout'
import NotFound from './components/NotFound'
import Employee from './pages/Employee'
import Department from './pages/Department'
import LeaveRequest from './pages/LeaveRequest'

function App() {


  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
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
            path="/employees"
            element={
              <ProtectedRoute>
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <Department />
              </ProtectedRoute>
            }
          />
          <Route path="/leave-requests" element={
              <ProtectedRoute>
                <LeaveRequest />
              </ProtectedRoute>} />
          <Route path="*" element={<NotFound />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App
