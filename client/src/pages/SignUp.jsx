import { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/useAuth';

const BASE_URL = 'http://localhost:8000';

const Signup = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');

    const { login } = useAuthStore();

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            console.log("Inside user signup of frontend about to make requesto to backend");
            
            const res = await axios.post(
                `${BASE_URL}/api/user/signup`,
                {
                    userName,
                    email,
                    password,
                    age,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
            // if (res.ok === false) {
            //     console.log("Some problem occurred while logging in: ", res);
            //     return;
            // }
            console.log('Response returned about to make request login of AuthController');
            console.log(res.data);

            const is_fine = login(email, password);
            if(!is_fine)  {
                toast.error('Signup unsuccessfull');
                return;
            }
            toast.success('Signup successful!');

            navigate('/'); 
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-green-100 to-blue-200 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-green-500 p-3 rounded-full shadow-lg">
                        <UserIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mt-3 text-gray-800">Create Account</h2>
                    <p className="text-gray-500 text-sm">Join us by filling the form below</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            placeholder="Unique username"
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                            placeholder="Enter your age"
                            min="1"
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition duration-200 cursor-pointer"
                    >
                        Sign Up
                    </button>

                    <div className="text-center text-sm mt-4">
                        Already have an account?{' '}
                        <a href="/login" className="text-green-600 hover:underline">
                            Log in
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;

