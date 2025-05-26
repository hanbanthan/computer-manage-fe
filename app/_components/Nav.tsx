'use client'

import { useState } from "react"
import useUserService from "../_services/useUserService";
import NavLink from "./NavLink";

export default function Nav() {
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    const userService = useUserService();

    async function logout() {
        setLoggingOut(true);
        //await userService.logout();
    }

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
            <div className="navbar-nav">
                <NavLink href="/" exact className="nav-item nav-link">Home</NavLink>
                <NavLink href="/computers" className="nav-item nav-link">Computers</NavLink>
                <button onClick={logout} className="btn btn-link nav-item nav-link" style={{ width: '67px' }} disabled={loggingOut}>
                    {
                        loggingOut
                            ? <span className="spinner-border spinnder-border-sm"></span>
                            : <span>Logout</span>
                    }
                </button>
            </div>
        </nav >
    );
}