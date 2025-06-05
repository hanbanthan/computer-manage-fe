'use client';

import AddEdit from "@/app/_components/computers/add-edit";
import Spinner from "@/app/_components/spinner";
import { useAuth } from "@/app/_context/auth-context";
import useComputerService from "@/app/_services/useComputerService";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Edit() {
    const { id } = useParams();;
    const { token } = useAuth();
    const router = useRouter();
    const computerService = useComputerService();
    const computer = computerService.computer;

    
    useEffect(() => {
        if (!id ) return;
        computerService.getById(id, token);
    },[router]);

    return computer
        ? <AddEdit title="Edit Computer" computer={computer} />
        : <Spinner />;


}