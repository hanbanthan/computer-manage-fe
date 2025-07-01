'use client';

import AddEdit from "@/app/_components/computers/add-edit";
import Spinner from "@/app/_components/spinner";
import useComputerService from "@/app/_services/useComputerService";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Edit() {
    const { id } = useParams();;
    const router = useRouter();
    const computerService = useComputerService();
    const computer = computerService.computer;

    
    useEffect(() => {
        if (!id) return;
        const computerId = Array.isArray(id) ? id[0] : id;
        computerService.getById(computerId);
    },[router]);

    return computer
        ? <AddEdit title="Edit Computer" computer={computer} />
        : <Spinner />;


}