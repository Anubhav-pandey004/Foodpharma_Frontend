
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SummaryApi from '../common/index'
import { toast } from 'react-toastify';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()

   

    const onSubmit = async(e) => {
        const dataResponse=await fetch(SummaryApi.login.url,{
          method:SummaryApi.login.method,
          credentials:'include',
          headers:{
            "content-type" : "application/json"
          },
          body:JSON.stringify(e)
        })
    
        const data=await dataResponse.json()
        console.log(data);
        
        if(data.success){
          toast.success(data.message)
          navigate("/")
        }
        if(data.error)
        {
          toast.error(data.message)
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
                            {...register('email', { required: 'Email is required' })}
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
                                {...register('password', { required: 'Password is required', minLength: 6 })}
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
                        className="w-full bg-gradient-to-br from-[#b5e48c] to-[#73a942] cursor-pointer text-[#132a13] px-6 py-2 rounded-lg transition-all duration-200 font-medium"
                    >
                        Login
                    </button>

                    {/* No Account? */}
                    <p className="text-center text-gray-400">
                        Don't have an account? <a onClick={()=>navigate("/signup")} className="text-[#132a13] cursor-pointer">Sign Up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
