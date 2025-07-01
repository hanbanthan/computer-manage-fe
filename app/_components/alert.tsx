'use client';

import { usePathname } from "next/navigation";
import useAlertService from "../_services/useAlertService";
import { useEffect } from "react";

export default function Alert() {
    const pathname = usePathname();
    const alertService = useAlertService();
    const alert = alertService.alert;

    useEffect(() => {
        // clear alert on location change
        alertService.clear();
    }, [pathname]);

    if (!alert) return null;

    return (
        <div className="container">
            <div className="m-3">
                <div className={`alert alert-dismissible ${alert.type}`}>
                    {alert.message}
                    <button type="button" className="btn-close" onClick={alertService.clear}></button>
                </div>
            </div>
        </div>
    );
}