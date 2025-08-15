import { Routes, Route, Navigate } from 'react-router-dom'
import PublicSearch from '@pages/PublicSearch'
import DeceasedDetail from '@pages/DeceasedDetail'
import Login from '@features/auth/Login'
import Register from '@features/auth/Register'
import AdminLayout from '@pages/admin/AdminLayout'
import BurialCreate from '@pages/admin/BurialCreate'
import BurialList from '@pages/admin/BurialList'
import PlotCreate from '@pages/admin/PlotCreate'
import PlotList from '@pages/admin/PlotList'
import PeopleList from '@pages/admin/PeopleList'
import ProtectedRoute from '@features/auth/ProtectedRoute'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<PublicSearch />} />
            <Route path="/deceased/:id" element={<DeceasedDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="people" replace />} />
                <Route path="people" element={<PeopleList />} />
                <Route path="plots" element={<PlotList />} />
                <Route path="burials" element={<BurialList />} />
                <Route path="burials/new" element={<BurialCreate />} />
                <Route path="plots/new" element={<PlotCreate />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}
