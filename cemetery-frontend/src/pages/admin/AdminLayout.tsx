import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'

export default function AdminLayout() {
    const navigate = useNavigate()
    const loc = useLocation()
    const item = (to: string, label: string) => (
        <Link to={to} className={`hover:underline ${loc.pathname.startsWith(to) ? 'font-semibold' : ''}`}>{label}</Link>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="font-semibold text-charcoal">M&TC Admin</div>
                    <nav className="flex items-center gap-4">
                        {item('/admin/people', 'People')}
                        {item('/admin/plots', 'Plots')}
                        {item('/admin/burials', 'Burials')}
                        {item('/admin/burials/new', 'Add Burial')}
                        {item('/admin/plots/new', 'Add Plot')}
                        <button className="btn" onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>
                            Logout
                        </button>
                    </nav>
                </div>
            </header>
            <main className="max-w-6xl mx-auto p-4">
                <Outlet />
            </main>
        </div>
    )
}
