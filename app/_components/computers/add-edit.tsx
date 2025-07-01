'use client'

import { useAuth } from "@/app/_context/auth-context";
import useAlertService from "@/app/_services/useAlertService";
import useComputerService from "@/app/_services/useComputerService";
import Link from "next/link";
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";

interface IComputer {
    computer_id?: string,
    user_id?: string,
    name: string,
    cpu: string,
    ram: string,
    ssd: string,
    hdd: string,
    room: string,
    note: string,
}

export default function AddEdit({ title, computer }: { title: string, computer?: IComputer }) {
    const { token } = useAuth();
    const router = useRouter();
    const alertService = useAlertService();
    const computerService = useComputerService();

    const { register, handleSubmit, reset, formState } = useForm({ defaultValues: computer });
    const { errors } = formState;

    const fields = {
        name: register('name', { required: 'name is required' }),
        cpu: register('cpu', { required: 'cpu is required' }),
        ram: register('ram', { required: 'ram is required' }),
        ssd: register('ssd', { required: 'ssd is required' }),
        hdd: register('hdd', { required: 'hdd is required' }),
        room: register('room', { required: 'room is required' }),
        note: register('note', { required: 'note is required' }),
    }

    type ComputerFormData = {
        computer_id?: string;
        user_id?: string;
        name: string;
        cpu: string;
        ram: string;
        ssd: string;
        hdd: string;
        room: string;
        note: string;
    };

    async function onSubmit(data: ComputerFormData) {
        alertService.clear();
        try {
            let message;
            if (computer) {
                const {
                    name, cpu, ram, ssd, hdd, room, note
                } = data;

                const cleanedData = {
                    name, cpu, ram, ssd, hdd, room, note
                };
                if (computer.computer_id) await computerService.updateById(computer.computer_id, cleanedData, token);
                message = 'Computer updated';
            } else {
                await computerService.create(data, token);
                message = 'Computer added';
            }

            router.push('/computers');
            alertService.success(message, true);
        } catch (error) {
            alertService.error(
                error instanceof Error ? error.message : String(error)
            );
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="mb-4">{title}</h1>

            <div className="mb-3 row">
                <label className="col-1 col-form-label" style={{ width: "60px" }}>Name</label>
                <div className="col-8">
                    <input {...fields.name} type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.name?.message?.toString()}</div>
                </div>
            </div>

            <div className="mb-3 row">
                <label className="col-1 col-form-label" style={{ width: "60px" }}>Cpu</label>
                <div className="col-8">
                    <input {...fields.cpu} type="text" className={`form-control ${errors.cpu ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.cpu?.message?.toString()}</div>
                </div>
            </div>

            <div className="mb-3 row">
                <label className="col-1 col-form-label" style={{ width: "60px" }}>Ram</label>
                <div className="col-8">
                    <input {...fields.ram} type="text" className={`form-control ${errors.ram ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.ram?.message?.toString()}</div>
                </div>
            </div>

            <div className="mb-3 row">
                <label className="col-1 col-form-label" style={{ width: "60px" }}>Ssd</label>
                <div className="col-8">
                    <input {...fields.ssd} type="text" className={`form-control ${errors.ssd ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.ssd?.message?.toString()}</div>
                </div>
            </div>

            <div className="mb-3 row">
                <label className="col-1 col-form-label" style={{ width: "60px" }}>Hdd</label>
                <div className="col-8">
                    <input {...fields.hdd} type="text" className={`form-control ${errors.hdd ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.hdd?.message?.toString()}</div>
                </div>
            </div>

            <div className="mb-3 row">
                <label className="col-1 col-form-label" style={{ width: "60px" }}>Room</label>
                <div className="col-8">
                    <input {...fields.room} type="text" className={`form-control ${errors.room ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.room?.message?.toString()}</div>
                </div>
            </div>

            <div className="mb-3 row">
                <label className="col-1 col-form-label" style={{ width: "60px" }}>Note</label>
                <div className="col-8">
                    <textarea {...fields.note} rows={7} className={`form-control ${errors.note ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.note?.message?.toString()}</div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-1" style={{ width: "60px" }}></div>
                <div className="col-8 d-flex justify-content-end gap-2">
                    <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary me-2">
                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                        Save
                    </button>
                    <button onClick={() => reset()} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                    <Link href="/computers" className="btn btn-link">Cancel</Link>
                </div>
            </div>
        </form>
    );

}