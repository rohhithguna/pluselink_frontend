import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { isAuthenticated, hasRole } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (roles.length > 0 && !hasRole(roles)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
