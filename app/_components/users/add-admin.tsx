'use client'

import { useAuth } from "@/app/_context/auth-context";
import useAlertService from "@/app/_services/useAlertService";
import useUserService from "@/app/_services/useUserService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function AddAdmin({ title }: { title: string }) {
    const { token } = useAuth();
    const router = useRouter();
    const alertService = useAlertService();
    const userService = useUserService();


    const { register, handleSubmit, reset, formState } = useForm();
    const { errors } = formState;

    const fields = {
        username: register('username', { required: 'username is required' }),
        password: register('password', { required: 'password is required' }),
    }

    type UserFormData = {
        username: string,
        password: string,
    }

    async function onSubmit(data: UserFormData) {
        alertService.clear();
        try {
            const message = 'Admin added';
            await userService.createNewAdmin(data.username, data.password, token);
            router.push('/users');
            alertService.success(message, true);
        } catch (error) {
            alertService.error(
                error instanceof Error ? error.message : String(error)
            );
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>{title}</h1>
            <div className="row">
                <div className="mb-3 col">
                    <label className="form-label">username</label>
                    <input {...fields.username} type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.name?.message?.toString()}</div>
                </div>
                <div className="mb-3 col">
                    <label className="form-label">password</label>
                    <input {...fields.password} type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.name?.message?.toString()}</div>
                </div>
                <div className="mb-3">
                    <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary me-2">
                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                        Save
                    </button>
                    <button onClick={() => reset()} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                    <Link href="/users" className="btn btn-link">Cancel</Link>
                </div>
            </div>
        </form>
    );

}