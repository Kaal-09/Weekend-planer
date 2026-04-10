import { useEffect, useRef, useState } from 'react';
import {
    Compass,
    ArrowLeft,
    Save,
    Camera,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/LeftSideBar';
import { useAuthStore } from '../context/useAuth.jsx';
import { axiosInstance } from '../utils/axiosInstance.js';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";


const EditProfile = () => {
    const { userEmail, setUserEmail } = useAuthStore();
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    console.log('User Email inside editprofile: ', userEmail);


    useEffect(() => {
        const run = async () => {
            if (userEmail === null) return;
            if (!userEmail) return;

            const res = await axiosInstance.get(`/user/getleanuserByEmail/${userEmail}`)
            console.log('Inside edit profile page and the response oblect obtained is: ', res.data);
            setUser(res.data.user);
        }
        run();
    }, [userEmail]);
    const [formData, setFormData] = useState({
        userName: user?.userName || "",
        email: user?.email || "",
        age: user?.age || 20,
        occupation: user?.occupation || "Professional",
        bio: user?.bio || "",
        prefrences: {
            categories: user?.prefrences?.categories || [],
            budget: user?.prefrences?.budget || "medium",
            travelRadius: user?.prefrences?.travelRadius || 10
        },
        homeLocation: {
            lat: user?.homeLocation?.lat || 25.000,
            lng: user?.homeLocation?.lng || 71.000
        }
    });
    useEffect(() => {
        if (!user) return;

        setFormData({
            userName: user.userName || "",
            email: user.email || "",
            age: user.age || 20,
            occupation: user.occupation || "Professional",
            bio: user.bio || "",
            prefrences: {
                categories: user.prefrences?.categories || [],
                budget: user.prefrences?.budget || "medium",
                travelRadius: user.prefrences?.travelRadius || 10
            },
            homeLocation: {
                lat: user.homeLocation?.lat || 25.000,
                lng: user.homeLocation?.lng || 71.000
            }
        });

    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePreferenceChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            prefrences: { ...prev.prefrences, [key]: value }
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    }

    const toggleCategory = (cat) => {
        const current = formData.prefrences.categories;
        const updated = current.includes(cat)
            ? current.filter(c => c !== cat)
            : [...current, cat];
        handlePreferenceChange('categories', updated);
    };

    const handleFileChange = async (e) => {
        const gotfile = e.target.files[0];
        if (!gotfile) return;

        setFile(gotfile);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const onCancel = (e) => {
        navigate('/profile')
    }

    const onSave = async (e) => {
        const formToSubmit = new FormData();
        if (file && file !== null) formToSubmit.append("avatar", file);
        formToSubmit.append("userName", formData.userName);
        formToSubmit.append("email", formData.email);
        formToSubmit.append("age", formData.age);
        formToSubmit.append("occupation", formData.occupation);
        formToSubmit.append("bio", formData.bio);
        formToSubmit.append(
            "prefrences",
            JSON.stringify({
                categories: formData.prefrences.categories,
                budget: formData.prefrences.budget,
                travelRadius: formData.prefrences.travelRadius
            })
        );
        formToSubmit.append(
            "homeLocation",
            JSON.stringify({
                lat: formData.homeLocation.lat,
                lng: formData.homeLocation.lng
            })
        );
        console.log('Form submit clicked and everthing is setup making backend call');

        try {
            const res = await axiosInstance.patch(
                `/user/update/${userEmail}`,
                formToSubmit,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                },
            );

            console.log("Upload success:", res.data);
            if (res.data?.user) {
                setUser(res.data.user);
                setUserEmail("");
                setUserEmail(res.data.user.email);
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to update profile");
        }
    }

    return (
        <div className="flex flex-col bg-[#f7f5f0] h-[200%]">
            <Navbar />

            <div className="flex flex-1">
                <aside className="w-72 flex-none bg-[#f7f5f0] border-r border-stone-200 overflow-y-auto">
                    <Sidebar />
                </aside>
                <main className="absolute left-100 flex-1 overflow-y-auto top-10 p-6 md:p-10 bg-[#f7f5f0]">
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-8">
                            <h1 className="text-2xl font-semibold text-stone-800">Edit Profile</h1>
                            <p className="text-stone-500">Manage your account settings and preferences.</p>
                        </header>

                        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto" encType='multipart/form-data'>
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <button
                                        onClick={onCancel}
                                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors font-bold mb-2"
                                    >
                                        <ArrowLeft size={14} /> Back to Profile
                                    </button>
                                    <h1 className="font-serif text-3xl text-slate-900">Edit Settings</h1>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onCancel}
                                        className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-xs font-bold hover:bg-white transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:opacity-90 shadow-lg shadow-slate-200 transition-all flex items-center gap-2"
                                    >
                                        <Save size={14} /> Save Changes
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-6">

                                <div className="col-span-12 lg:col-span-7 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                                    <h3 className="font-serif text-xl text-slate-900 mb-6">Public Identity</h3>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="relative group">
                                                <div className="w-24 h-24 rounded-4xl bg-[#e8e0d8] flex items-center justify-center font-serif text-2xl text-[#5c4a3a] overflow-hidden">
                                                    {user?.profilePic ? (
                                                        <img
                                                            src={user.profilePic}
                                                            alt="Profile Avatar"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span>
                                                            {formData.userName ? formData.userName.split(' ').map(n => n[0]).join('') : '?'}
                                                        </span>
                                                    )}
                                                </div>

                                                <div
                                                    onClick={handleImageClick}
                                                    className="absolute inset-0 bg-black/20 rounded-4xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                                                >
                                                    <Camera size={20} className="text-white" />
                                                </div>

                                                {/* The Hidden Input (Remains Unchanged) */}
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold text-slate-900 mb-1">Avatar Image</p>
                                                <p className="text-xs text-slate-400">JPG, GIF or PNG. 1MB Max.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2 ml-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="userName"
                                                    value={formData.userName}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-slate-300 focus:bg-white outline-none transition-all text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2 ml-1">Occupation</label>
                                                <select
                                                    name="occupation"
                                                    value={formData.occupation}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-slate-300 focus:bg-white outline-none transition-all text-sm appearance-none"
                                                >
                                                    {['Student', 'Professional', 'Researcher', 'Educator', 'Other'].map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2 ml-1">Age</label>
                                                <input
                                                    type="number"
                                                    name="age"
                                                    value={formData.age}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-slate-300 focus:bg-white outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2 ml-1">Bio</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                rows="3"
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-slate-300 focus:bg-white outline-none transition-all text-sm resize-none font-serif italic"
                                                placeholder="Chasing light on mountain trails..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-12 lg:col-span-5 space-y-6">
                                    <div className="bg-[#1a1814] rounded-[2.5rem] p-8 text-white shadow-xl">
                                        <h3 className="font-serif text-xl text-[#d4c9b0] mb-6">Travel Style</h3>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold block mb-4">Interests</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {["nature", "food", "adventure"].map(cat => (
                                                        <button
                                                            key={cat}
                                                            type="button"
                                                            onClick={() => toggleCategory(cat)}
                                                            className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all border ${formData.prefrences.categories.includes(cat)
                                                                ? 'bg-[#d4c9b0] text-[#1a1814] border-[#d4c9b0]'
                                                                : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'
                                                                }`}
                                                        >
                                                            {cat}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold block mb-4">Budget Range</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {["low", "medium", "high"].map(b => (
                                                        <button
                                                            key={b}
                                                            type="button"
                                                            onClick={() => handlePreferenceChange('budget', b)}
                                                            className={`py-2 rounded-xl text-[10px] uppercase tracking-tighter font-black transition-all border ${formData.prefrences.budget === b
                                                                ? 'bg-white text-slate-900 border-white shadow-lg'
                                                                : 'bg-white/5 text-white/30 border-white/10 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            {b}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center gap-2">
                                                <Compass size={18} className="text-slate-400" />
                                                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Search Radius</label>
                                            </div>
                                            <span className="text-sm font-serif text-slate-900">{formData.prefrences.travelRadius}km</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="500"
                                            value={formData.prefrences.travelRadius}
                                            onChange={(e) => handlePreferenceChange('travelRadius', e.target.value)}
                                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-12 bg-[#f5f0e8] rounded-[2.5rem] p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="font-serif text-xl text-[#3a3228] mb-4">Base Location</h3>
                                            <p className="text-xs text-[#a08c70] mb-6 leading-relaxed">
                                                Your home coordinates are used to calculate travel times and nearby recommendations.
                                            </p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] uppercase tracking-widest text-[#a08c70] font-bold block mb-2">Latitude</label>
                                                    <input
                                                        type="number"
                                                        value={formData.homeLocation.lat}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, homeLocation: { ...prev.homeLocation, lat: e.target.value } }))}
                                                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#e8e0d8] focus:border-[#c4b89a] outline-none transition-all text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase tracking-widest text-[#a08c70] font-bold block mb-2">Longitude</label>
                                                    <input
                                                        type="number"
                                                        value={formData.homeLocation.lng}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, homeLocation: { ...prev.homeLocation, lng: e.target.value } }))}
                                                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#e8e0d8] focus:border-[#c4b89a] outline-none transition-all text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-l border-[#e8e0d8] pl-0 md:pl-8">
                                            <h3 className="font-serif text-xl text-[#3a3228] mb-4">Account Security</h3>
                                            <div className="space-y-4">
                                                <div className="p-4 bg-white/50 rounded-2xl border border-[#e8e0d8]">
                                                    <p className="text-[10px] uppercase tracking-widest text-[#a08c70] font-bold mb-1">Email Address</p>
                                                    <p className="text-sm text-slate-600">{formData.email}</p>
                                                </div>
                                                <button type="button" className="w-full py-3 rounded-xl border border-dashed border-[#c4b89a] text-[#9e7e4e] text-xs font-bold hover:bg-white/50 transition-all">
                                                    Change Password
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditProfile;