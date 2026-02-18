'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    BarChart2,
    Ticket,
    Settings,
    Activity,
    Menu,
    ShieldAlert,
    History
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Ticket Builder', href: '/ticket-builder', icon: Ticket },
    { name: 'History', href: '/history', icon: History },
    { name: 'Match Details', href: '/match-details', icon: Activity },
    { name: 'Performance', href: '/performance', icon: BarChart2 },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function AppSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg bg-gray-900 text-white shadow-lg"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex h-16 items-center justify-center border-b border-gray-800">
                    <Link href="/" className="flex items-center space-x-2">
                        <ShieldAlert className="text-blue-500" size={24} />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                            QuantBet AI
                        </span>
                    </Link>
                </div>

                <nav className="p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors relative group
                  ${isActive
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/10 rounded-lg border border-blue-500/20"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <item.icon size={20} className="mr-3 z-10" />
                                <span className="font-medium z-10">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-4 left-0 right-0 p-4 border-t border-gray-800">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 font-mono mb-1">SYSTEM STATUS</div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm text-gray-300">Operational</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
