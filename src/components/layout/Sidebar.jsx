import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Inbox,
    Calendar,
    FileText,
    Users,
    Package,
    UserCog,
    Plug,
    Settings,
    X,
    Sparkles
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Inbox', href: '/inbox', icon: Inbox },
        { name: 'Bookings', href: '/bookings', icon: Calendar },
        { name: 'Forms', href: '/forms', icon: FileText },
        { name: 'Contacts', href: '/leads', icon: Users },
        { name: 'Inventory', href: '/inventory', icon: Package },
        { name: 'Staff', href: '/staff', icon: UserCog },
        { name: 'Integrations', href: '/integrations', icon: Plug },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 z-50 h-full w-56 bg-white border-r border-slate-200 shadow-xl lg:shadow-none
                transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-1.5 rounded-lg shadow-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                CareOps
                            </span>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="p-1 rounded-lg hover:bg-slate-100 lg:hidden"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                        {navigation.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                                        flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm
                                        ${active
                                            ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }
                                    `}
                                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                >
                                    <item.icon className={`
                                        w-4 h-4 mr-3 transition-colors
                                        ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}
                                    `} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile / Footer */}
                    <div className="p-3 border-t border-slate-100">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3">
                            <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider mb-0.5">
                                Need Help?
                            </p>
                            <p className="text-[10px] text-slate-600 mb-2 leading-tight">
                                Check our documentation or contact support.
                            </p>
                            <button className="text-xs font-medium text-indigo-700 hover:text-indigo-800 hover:underline">
                                Contact Support →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
