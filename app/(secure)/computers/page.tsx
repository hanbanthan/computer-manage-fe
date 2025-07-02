'use client';

import Spinner from "@/app/_components/spinner";
import useComputerService from "@/app/_services/useComputerService";
import useUserService from "@/app/_services/useUserService";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Computers() {
    const [query, SetQuery] = useState("");
    const computerService = useComputerService();
    const computers = computerService.computers;
    const { currentUser } = useUserService();

    const updateQuery = (query: string) => {
        SetQuery(query.trim());
    }

    const clearQuery = () => {
        updateQuery("");
    }

    useEffect(() => {
        computerService.getAll();
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
                                    <td
                                        title={computer.note}
                                        style={{
                                            maxWidth: '200px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {computer.note}
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        {(
                                            currentUser?.role === 'admin' ||
                                            currentUser?.role === 'superadmin') && (
                                                <>
                                                    <Link
                                                        href={`/computers/edit/${computer.computer_id}`}
                                                        className="btn btn-sm btn-primary me-1"
                                                        style={{ width: '60px' }}
                                                    >
                                                        Detail
                                                    </Link>
                                                    <button
                                                        onClick={() => computer.computer_id && computerService.deleteById(computer.computer_id)}
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
            <h1 className="mb-3">Computers</h1>

            <div className="d-flex align-items-center mb-3">
                {(currentUser?.role === 'admin' ||
                    currentUser?.role === 'superadmin') && (
                        <div>
                            <Link href="/computers/add" className="btn btn-sm btn-success mb-2" style={{ height: '38px' }}>Add Computer</Link>
                        </div>)}

                <div className="input-group ms-auto" style={{ maxWidth: '300px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Search Computers"
                        value={query}
                        onChange={(event) => updateQuery(event.target.value)}
                    />
                </div>
            </div>
            <table className="table table-striped w-100" style={{ tableLayout: 'auto' }}>
                <thead>
                    <tr>
                        <th style={{ width: '13%', backgroundColor: '#808080', color: 'white' }}>Name</th>
                        <th style={{ width: '13%', backgroundColor: '#808080', color: 'white' }}>Cpu</th>
                        <th style={{ width: '13%', backgroundColor: '#808080', color: 'white' }}>Ram</th>
                        <th style={{ width: '13%', backgroundColor: '#808080', color: 'white' }}>Ssd</th>
                        <th style={{ width: '13%', backgroundColor: '#808080', color: 'white' }}>Hdd</th>
                        <th style={{ width: '13%', backgroundColor: '#808080', color: 'white' }}>Room</th>
                        <th style={{ width: '13%', backgroundColor: '#808080', color: 'white' }}>Note</th>
                        <th style={{ width: '9%', backgroundColor: '#808080', color: 'white' }}></th>
                    </tr>
                </thead>
                <tbody>
                    <TableBody />
                </tbody>
            </table>
        </>
    );
}