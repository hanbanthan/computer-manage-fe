'use client';

import Spinner from "@/app/_components/spinner";
import useComputerService from "@/app/_services/useComputerService";
import useUserService from "@/app/_services/useUserService";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

export default function Computers() {
    const [query, SetQuery] = useState("");
    const [sortMode, setSortMode] = useState<"newest" | "oldest">("newest");
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
        const sortOrder = sortMode === "newest" ? "DESC" : "ASC";
        computerService.getAll(sortOrder);
    }, [sortMode]);

    const handleSortChange = useCallback(
        (newSortMode: "newest" | "oldest") => {
            if (newSortMode !== sortMode) {
                setSortMode(newSortMode);
            }
        }, [sortMode]);

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
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
                {(currentUser?.role === 'admin' ||
                    currentUser?.role === 'superadmin') && (
                        <div>
                            <Link href="/computers/add" className="btn btn-sm btn-success" style={{ height: '38px' }}>Add Computer</Link>
                        </div>)}

                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 ms-md-auto">
                    <div className="d-flex align-items-center">
                        <label htmlFor="sort-select" className="text-sm text-gray-600 me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>
                            Sort by:
                        </label>

                        <select
                            id="sort-select"
                            value={sortMode}
                            onChange={(e) =>
                                handleSortChange(e.target.value as "newest" | "oldest")
                            }
                            className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-pink-500 focus:border-pink-500 shadow-sm disabled:opacity-70"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>

                    <div className="input-group" style={{ maxWidth: '300px' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="🔍 Search Computers"
                            value={query}
                            onChange={(event) => updateQuery(event.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="table-responsive">
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
            </div>
        </>
    );
}