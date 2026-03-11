import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ role }) {
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl leading-none">H</span>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 tracking-tight">HospiFlow</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 shadow-inner">
                            {role} View
                        </span>
                        <button 
                            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                            className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
