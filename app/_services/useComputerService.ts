import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "../_helpers/client/useFetch";
import useAlertService from "./useAlertService"
import { create } from "zustand";
import { env } from "../_helpers/config";

interface IComputer {
    id: string,
    cpu: string,
    ram: string,
    ssd: string,
    hdd: string,
    room: string,
    building: string,
}

interface IComputerStore {
    computer?: IComputer,
    computers?: IComputer[],
}

interface IComputerService extends IComputerStore {
    getAll: () => Promise<void>,
    getById: (id: string) => Promise<void>,
    updateById: (id: string, params: Partial<IComputer>) => Promise<void>,
    create: (computer: IComputer) => Promise<void>,
    deleteById: (id: string) => Promise<void>,
}

const initialState = {
    computer: undefined,
    computers: undefined,
}

const computerStore = create<IComputerStore>(() => initialState);

export default function useComputerService(): IComputerService {
    const alertService = useAlertService();
    const fetch = useFetch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { computer, computers } = computerStore();

    return {
        computer,
        computers,
        getAll: async () => {
            const response =  await fetch.get(`${env.be.url}/api/computers`)
            computerStore.setState({ computers: response.computers});
        },
        getById: async (id) => {
            computerStore.setState({ computer: undefined });
            try {
                const response = await fetch.get(`${env.be.url}/api/computers/${id}`);
                computerStore.setState({ computer: response.computer });
            } catch (error) {
                alertService.error(
                    error instanceof Error ? error.message : String(error)
                );
            }
        },
        create: async (computer) => {
            await fetch.post(`${env.be.url}/api/computers`, computer);
        },
        updateById: async (id, params) => {
            await fetch.patch(`${env.be.url}/api/computers/${id}`, params);
        },
        deleteById: async (id) => {
            //set isDeleting prop to true on user
            // computerStore.setState({
            //     computers: computers?.map( computer => {
            //         if (computer.id === id) computer.isDeleting = true;
            //     })
            // })

            await fetch.delete(`${env.be.url}/api/computers/${id}`);

            computerStore.setState({ computers: computers?.filter(computer => computer.id !== id) });
        }
    }
}