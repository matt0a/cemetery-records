// src/layouts/AdminLayout.tsx
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
    Menu, X, Users, MapPin, Archive, SquarePlus, LogOut
} from 'lucide-react'

type Item = {
    to: string
    label: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    exact?: boolean
}

const ITEMS: Item[] = [
    { to: '/admin/people', label: 'People', icon: Users },
    { to: '/admin/plots', label: 'Plots', icon: MapPin, exact: true },
    { to: '/admin/plots/available', label: 'Available plots', icon: MapPin },
    { to: '/admin/burials', label: 'Burials', icon: Archive, exact: true },
    { to: '/admin/burials/new', label: 'Add Burial', icon: SquarePlus, exact: true },
    { to: '/admin/plots/new', label: 'Add Plot', icon: SquarePlus, exact: true },
]

export default function AdminLayout() {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const linkBase =
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors'
    const linkInactive = 'text-gray-700 hover:bg-gray-50'
    const linkActive = 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Overlay (mobile) */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden ${
                    open ? 'block' : 'hidden'
                }`}
                onClick={() => setOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed md:static z-50 inset-y-0 left-0 w-72 bg-white border-r
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                {/* Sidebar header (mobile shows a close button) */}
                <div className="flex items-center justify-between px-4 h-14 border-b">
                    <div className="font-semibold text-charcoal">M&TC Admin</div>
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-50"
                        onClick={() => setOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="p-3 space-y-1">
                    {ITEMS.map(({ to, label, icon: Icon, exact }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={!!exact}
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? linkActive : linkInactive}`
                            }
                            onClick={() => setOpen(false)}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </NavLink>
                    ))}

                    {/* Logout */}
                    <button
                        className={`${linkBase} ${linkInactive} w-full`}
                        onClick={() => {
                            localStorage.removeItem('token')
                            navigate('/login')
                        }}
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main column */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Top bar */}
                <header className="h-14 bg-white border-b flex items-center px-3 md:px-6">
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-50"
                        onClick={() => setOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="ml-2 md:ml-0 font-medium text-gray-700">
                        Admin dashboard
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
