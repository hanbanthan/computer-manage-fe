'use client';

import AddEdit from "@/app/_components/computers/AddEdit";
import Spinner from "@/app/_components/Spinner";
import useComputerService from "@/app/_services/useComputerService";
import { useRouter } from "next/navigation";
import { useEffect, use } from "react";

type EditPageProps = {
    params: {
        id: string;
    };
};

export default function Edit({ params }: EditPageProps) {
    const { id } = params;
    const router = useRouter();
    const computerService = useComputerService();
    const computer = computerService.computer;
    
    useEffect(() => {
        computerService.getById(id);
    },[router]);

    return computer
        ? <AddEdit title="Edit Computer" computer={computer} />
        : <Spinner />;


}