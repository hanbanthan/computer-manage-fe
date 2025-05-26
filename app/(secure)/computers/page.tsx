'use client';

import Spinner from "@/app/_components/Spinner";
import useComputerService from "@/app/_services/useComputerService";
import useUserService from "@/app/_services/useUserService";
import Link from "next/link";
import { useEffect } from "react";

interface Computer {
    id: string;
    name?: string;
    cpu?: string;
    ram?: string;
    ssd?: string;
    hdd?: string;
    room?: string;
    building?: string;
    isDeleting?: boolean;
    user?: {
        id: string;
        username: string;
    }
}

export default function Computers() {
    const computerService = useComputerService();
    const computers = computerService.computers;
    const { currentUser} = useUserService();

    useEffect(() => {
        computerService.getAll();
    }, []);

    function TableBody() {
    if (computers?.length) {
        return computers.map((computer: Computer) => {
            console.log('Current User:', currentUser?.username);
            console.log('Computer Owner:', computer.user?.username);
            return (
                <tr key={computer.id}>
                    <td>{computer.name}</td>
                    <td>{computer.cpu}</td>
                    <td>{computer.ram}</td>
                    <td>{computer.ssd}</td>
                    <td>{computer.hdd}</td>
                    <td>{computer.room}</td>
                    <td>{computer.building}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                        {computer.user?.username === currentUser?.username && (
                            <>
                                <Link
                                    href={`/computers/edit/${computer.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => computerService.deleteById(computer.id)}
                                    className="btn btn-sm btn-danger btn-delete-user"
                                    style={{ width: '60px' }}
                                    disabled={computer.isDeleting}
                                >
                                    {computer.isDeleting ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                        <span>Delete</span>
                                    )}
                                </button>
                            </>
                        )}
                    </td>
                </tr>
            );
        });
    }

        if (!computers) {
            return (
                <tr>
                    <td colSpan={7}>
                        <Spinner />
                    </td>
                </tr>
            );
        }

        if (computers?.length === 0) {
            return (
                <tr>
                    <td colSpan={7} className="text-center">
                        <div className="p-2">No Computers To Display</div>
                    </td>
                </tr>
            )
        }
    }

    return (
        <>
            <h1>Computers</h1>
            <Link href="/computers/add" className="btn btn-sm btn-success mb-2">Add Computer</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '13%' }}>name</th>
                        <th style={{ width: '13%' }}>cpu</th>
                        <th style={{ width: '13%' }}>ram</th>
                        <th style={{ width: '13%' }}>ssd</th>
                        <th style={{ width: '13%' }}>hdd</th>
                        <th style={{ width: '13%' }}>room</th>
                        <th style={{ width: '13%' }}>building</th>
                        <th style={{ width: '9%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    <TableBody />
                </tbody>
            </table>
        </>
    );
}