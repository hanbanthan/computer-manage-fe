'use client';

import Spinner from "@/app/_components/spinner";
import { useAuth } from "@/app/_context/auth-context";
import useComputerService from "@/app/_services/useComputerService";
import useUserService from "@/app/_services/useUserService";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Computers() {
    const [query, SetQuery] = useState("");
    const { token } = useAuth();
    const computerService = useComputerService();
    const computers = computerService.computers;
    const { currentUser } = useUserService();

    const updateQuery = (query) => {
        SetQuery(query.trim());
    }

    const clearQuery = () => {
        updateQuery("");
    }

    useEffect(() => {
        if (token) {
            computerService.getAll(token);
        }
    }, []);

    function TableBody() {
        if (computers?.length) {
            const showingComputers = query === "" ? computers : computers.filter((c) => c.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
            return (
                <>
                    {
                        showingComputers.length !== computers.length && (
                            <tr>
                                <td colSpan={8}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>
                                            Now showing {showingComputers.length} of {computers.length}
                                        </span>
                                        <button className="btn btn-sm btn-secondary" onClick={clearQuery}>
                                            Show all
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    }
                    {
                        showingComputers.map((computer) => {
                            return (
                                <tr key={computer.computer_id}>
                                    <td>{computer.name}</td>
                                    <td>{computer.cpu}</td>
                                    <td>{computer.ram}</td>
                                    <td>{computer.ssd}</td>
                                    <td>{computer.hdd}</td>
                                    <td>{computer.room}</td>
                                    <td>{computer.building}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        {(
                                            currentUser?.role === 'admin' ||
                                            currentUser?.role === 'superadmin') && (
                                                <>
                                                    <Link
                                                        href={`/computers/edit/${computer.computer_id}`}
                                                        className="btn btn-sm btn-primary me-1"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => computerService.deleteById(computer.computer_id, token)}
                                                        className="btn btn-sm btn-danger btn-delete-user"
                                                        style={{ width: '60px' }}
                                                    >
                                                        <span>Delete</span>
                                                    </button>
                                                </>
                                            )}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </>
            )
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
                    <td colSpan={8} className="text-center">
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
                        <th style={{ width: '9%' }}>
                            <div style={{ display: 'flex' }}>
                                🔎 <input
                                    type="text"
                                    placeholder="Search Computers"
                                    value={query}
                                    onChange={(event) => updateQuery(event.target.value)}
                                />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <TableBody />
                </tbody>
            </table>
        </>
    );
}