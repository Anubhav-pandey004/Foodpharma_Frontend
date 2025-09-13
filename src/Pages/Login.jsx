
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SummaryApi from '../common/index'
import { toast } from 'react-toastify';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const onSubmit = async (form) => {
        try {
            setLoading(true);
            const payload = {
                email: (form.email || '').trim().toLowerCase(),
                password: (form.password || '').trim(),
            };
            const resp = await fetch(SummaryApi.login.url, {
                method: SummaryApi.login.method,
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await resp.json();
            if (data.success) {
                toast.success(data.message || 'Logged in');
                // Fetch user details and redirect to health page if incomplete
                try {
                  const ud = await fetch(SummaryApi.userDetails.url, { method: SummaryApi.userDetails.method, credentials: 'include' });
                  const udJson = await ud.json();
                  if (udJson?.success && udJson?.data && udJson.data.healthProfileComplete === false) {
                    navigate('/health');
                  } else {
                    navigate('/');
                  }
                } catch {
                  navigate('/');
                }
            } else {
                toast.error(data.message || 'Invalid email or password');
            }
        } catch (e) {
            toast.error('Unable to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="w-[90%] max-w-md p-8 space-y-6 bg-[#dde5b6] border-[1px] border-[#7a9f0c] shadow-2xl backdrop-blur-md rounded-lg text-[#132a13]">
                <h2 className="text-3xl font-semibold text-center">Login</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            autoComplete="email"
                            maxLength={254}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid email address',
                                },
                            })}
                            className="w-full text-[#f8f9fa] p-3 rounded-lg bg-[#31572c] "
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                maxLength={128}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                                })}
                                className="w-full text-[#f8f9fa] p-3 rounded-lg bg-[#31572c] "
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-br from-[#b5e48c] to-[#73a942] cursor-pointer text-[#132a13] px-6 py-2 rounded-lg transition-all duration-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Login'}
                    </button>

                    {/* No Account? */}
                    <p className="text-center text-gray-400">
                        Don't have an account? <a onClick={() => navigate('/signup')} className="text-[#132a13] cursor-pointer">Sign Up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
