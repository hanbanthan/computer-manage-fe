'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

interface INavLink {
    children: React.ReactNode,
    href: string,
    exact?: boolean,
    [key: string]: unknown,
    className?: string;
}

export default function NavLink({ children, href, exact, className = "", ...props }: INavLink) {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    const combinedClassName = `${className} ${isActive ? "active" : ""}`.trim();
    
    return <Link href={href} className={combinedClassName} {...props}>{children}</Link>;
}