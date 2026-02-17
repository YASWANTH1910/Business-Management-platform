import {
    Menu,
    Bell,
    Search,
    Plus,
    ChevronDown
} from 'lucide-react';
import { useCareOps } from '../../context/CareOpsContext';

const Header = ({ toggleSidebar }) => {
    const { business, alerts } = useCareOps();
    const unreadAlerts = alerts.filter(a => !a.read).length;

    return (
        <header className="bg-white border-b border-slate-200 h-14 sticky top-0 z-30 px-3 sm:px-4">
            <div className="flex items-center justify-between h-full">
                {/* Left: Mobile Menu & Search */}
                <div className="flex items-center flex-1">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 mr-2 rounded-lg hover:bg-slate-100 lg:hidden text-slate-600"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="hidden md:flex items-center max-w-md w-full ml-4">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                placeholder="Search bookings, contacts, or messages..."
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    <button className="hidden sm:flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Quick Add
                    </button>

                    <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors">
                        <Bell className="w-6 h-6" />
                        {unreadAlerts > 0 && (
                            <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                        )}
                    </button>

                    <div className="flex items-center ml-2 pl-2 md:ml-4 md:pl-4 md:border-l md:border-slate-200">
                        <button className="flex items-center space-x-3 focus:outline-none group">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                    {business?.name || 'My Business'}
                                </p>
                                <p className="text-xs text-slate-500">Admin</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-transparent group-hover:ring-indigo-100 transition-all">
                                {business?.name?.charAt(0) || 'B'}
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
