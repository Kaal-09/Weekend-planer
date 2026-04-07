import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/LeftSideBar';
import ChatSidebar from '../components/RightSideBar';
import {
    User as UserIcon,
    Settings,
    Share,
    Compass,
    Wallet
} from 'lucide-react';
/* eslint-ignore suggestCanonicalClasses */
const ProfilePage = () => {

    const user = {
        userName: "Aarav Sharma",
        email: "aarav.travels@example.com",
        occupation: "Professional",
        age: 26,
        prefrences: {
            categories: ["nature", "adventure"],
            budget: "medium",
            travelRadius: 15
        },
        homeLocation: { lat: 25.000, long: 71.000 },
        friendsCount: 12,
        savedPlacesCount: 8,
        savedTripsCount: 3
    };

    return (
        <div className="h-screen bg-[#f8f9fa] flex flex-col overflow-hidden text-gray-800">
            <Navbar />

            <div className="flex flex-1 overflow-hidden pt-16">
                <Sidebar />

                <main className="flex-1 overflow-y-auto bg-[#f7f5f0] p-6 md:p-10 ml-72 transition-all duration-500 custom-scrollbar">
                    <div className="max-w-5xl mx-auto">

                        <div className="grid grid-cols-12 gap-4">

                            <div className="col-span-12 lg:col-span-8 bg-white border border-slate-100 rounded-4xl p-8">
                                <div className="flex gap-8 items-start">

                                    <div className="relative shrink-0">
                                        <div className="w-22 h-22 rounded-[1.75rem] bg-[#e8e0d8] flex items-center justify-center">
                                            <span className="font-serif text-[2rem] text-[#5c4a3a] tracking-tight">
                                                {user.userName.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h1 className="font-serif text-[1.85rem] font-bold text-slate-900 leading-tight mb-1">
                                            {user.userName}
                                        </h1>
                                        <p className="text-sm text-slate-400 font-normal mb-5">{user.occupation}</p>

                                        <div className="flex gap-7 py-4 border-y border-slate-100 mb-5">
                                            {[
                                                { value: user.friendsCount, label: 'Network' },
                                                { value: user.savedPlacesCount, label: 'Places' },
                                                { value: user.savedTripsCount, label: 'Trips' },
                                            ].map((s, i) => (
                                                <div key={i}>
                                                    <p className="font-serif text-[1.35rem] text-slate-900 leading-none">{s.value}</p>
                                                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400 mt-1">{s.label}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <button className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:opacity-80 transition-opacity">
                                                Edit profile
                                            </button>
                                            <button className="w-8.5 h-8.5 rounded-[10px] border border-slate-100 bg-slate-50 flex items-center justify-center hover:border-slate-200 transition-colors">
                                                <Settings size={14} className="text-slate-400" />
                                            </button>
                                            <button className="w-8.5 h-8.5 rounded-[10px] border border-slate-100 bg-slate-50 flex items-center justify-center hover:border-slate-200 transition-colors">
                                                <Share size={14} className="text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-4 bg-[#1a1814] rounded-4xl p-7 flex flex-col justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.14em] text-white/30 mb-3">Base location</p>
                                    <p className="font-serif text-[1.5rem] text-[#d4c9b0] leading-snug mb-5">
                                        {user.homeLocation.lat.toFixed(3)}°<br />{user.homeLocation.long.toFixed(3)}°
                                    </p>
                                    <div className="w-full h-18 rounded-xl bg-[#2a2720] relative overflow-hidden mb-4">
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                                                backgroundSize: '18px 18px',
                                            }}
                                        />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#d4c9b0] shadow-[0_0_0_4px_rgba(212,201,176,0.2)]" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                    <p className="text-[11px] text-white/35">{user.prefrences.travelRadius} km exploration radius</p>
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-4 bg-[#f5f0e8] rounded-4xl p-7 flex flex-col justify-between min-h-45">
                                <div>
                                    <p className="font-serif text-[3.5rem] text-[#c4b89a] leading-[0.6] mb-3">"</p>
                                    <p className="font-serif italic text-[1.05rem] text-[#3a3228] leading-relaxed">
                                        Chasing light on mountain trails and finding{' '}
                                        <span className="text-[#9e7e4e]">hidden food gems</span> between continents.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="h-px w-6 bg-[#c4b89a]" />
                                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#a08c70]">About me</p>
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-8 bg-white border border-slate-100 rounded-4xl p-7">
                                <div className="flex justify-between items-baseline mb-5">
                                    <h3 className="font-serif text-lg text-slate-900">Travel style</h3>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-400">Archetype</span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-5">
                                    {user.prefrences.categories.map((cat, i) => (
                                        <span
                                            key={cat}
                                            className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-colors cursor-default capitalize
                                                ${i < 3
                                                    ? 'bg-slate-900 text-white border-slate-900'
                                                    : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200'
                                                }`}
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-[14px] border border-slate-100 bg-slate-50">
                                        <Wallet size={14} className="text-slate-400 shrink-0" />
                                        <span className="text-[12px] text-slate-400">Budget</span>
                                        <span className="text-[12px] font-medium text-slate-700 ml-auto capitalize">{user.prefrences.budget}</span>
                                    </div>
                                    <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-[14px] border border-slate-100 bg-slate-50">
                                        <Compass size={14} className="text-slate-400 shrink-0" />
                                        <span className="text-[12px] text-slate-400">Radius</span>
                                        <span className="text-[12px] font-medium text-slate-700 ml-auto">{user.prefrences.travelRadius} km</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>

                <ChatSidebar />
            </div>
        </div>
    );
};

export default ProfilePage;