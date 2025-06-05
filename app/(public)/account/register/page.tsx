'use client'
import useUserService from '@/app/_services/useUserService';
import Link from 'next/link'
import { useForm } from "react-hook-form";

interface RegisterFormData {
    username: string;
    password: string;
}

export default function Register() {
     const userService = useUserService();

    const { register, handleSubmit, formState } = useForm<User>();
    const { errors } = formState;

    const fields = {
        username: register('username', { 
            required: 'Username is required',
        }),
            
        password: register('password', {
            required: 'Password is required',
        })
    }

    async function onSubmit({ username, password}: RegisterFormData) {
        await userService.register(username, password);
    }

    return (
        <div className="card">
            <h4 className="card-header">Register</h4>
            <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input {...fields.username} type="text" className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.username?.message?.toString()}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input {...fields.password} type="text" className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.password?.message?.toString()}</div>
                    </div>
                    <button disabled={formState.isSubmitting} className="btn btn-primary">
                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                        Register
                    </button>
                    <Link href="/account/login" className="btn btn-link">Cancel</Link>
                </form>
            </div>
        </div>
    );
}