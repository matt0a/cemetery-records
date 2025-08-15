import { Navigate, useLocation } from 'react-router-dom'
import {JSX} from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem('token')
    const location = useLocation()
    if (!token) return <Navigate to="/login" state={{ from: location }} replace />
    return children
}
