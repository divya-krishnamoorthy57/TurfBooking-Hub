import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { TurfListing } from '../pages/TurfListing';
import { TurfDetails } from '../pages/TurfDetails';
import { BookingSummary } from '../pages/BookingSummary';
import { BookingConfirmation } from '../pages/BookingConfirmation';
import { MyBookings } from '../pages/MyBookings';
import { Profile } from '../pages/Profile';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { AdminDashboard } from '../pages/AdminDashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/turfs" element={<TurfListing />} />
      <Route path="/turfs/:id" element={<TurfDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Customer Routes */}
      <Route
        path="/booking/summary"
        element={
          <ProtectedRoute>
            <BookingSummary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/confirmation"
        element={
          <ProtectedRoute>
            <BookingConfirmation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
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

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
