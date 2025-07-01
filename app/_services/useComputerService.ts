import useAlertService from "./useAlertService";
import { create } from "zustand";
import { env } from "../_helpers/config";

interface IComputer {
    computer_id?: string,
    user_id?: string,
    name: string,
    cpu: string,
    ram: string,
    ssd: string,
    hdd: string,
    room: string,
    note: string,
}

interface IComputerStore {
    computer?: IComputer,
    computers?: IComputer[],
}

interface IComputerService extends IComputerStore {
    getAll: () => Promise<void>,
    getById: (computer_id: string) => Promise<void>,
    updateById: (computer_id: string, params: Partial<IComputer>) => Promise<void>,
    create: (computer: IComputer) => Promise<void>,
    deleteById: (computer_id: string) => Promise<void>,
}

const initialState = {
    computer: undefined,
    computers: undefined,
};

const computerStore = create<IComputerStore>(() => initialState);

export default function useComputerService(): IComputerService {
    const alertService = useAlertService();
    const { computer, computers } = computerStore();

    return {
        computer,
        computers,
        getAll: async () => {
            try {
                const response = await fetch(`${env.be.url}/api/computer/list/all`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) throw new Error('Failed to fetch computers');

                const data = await response.json();
                computerStore.setState({ computers: data.computers });
            } catch (error) {
                alertService.error(error instanceof Error ? error.message : String(error));
            }
        },
        getById: async (computer_id: string) => {
            computerStore.setState({ computer: undefined });
            try {
                const response = await fetch(`${env.be.url}/api/computer/${computer_id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) throw new Error('Failed to fetch a computer');

                const data = await response.json();
                computerStore.setState({ computer: data.computer });
            } catch (error) {
                alertService.error(error instanceof Error ? error.message : String(error));
            }
        },
        create: async (computer: IComputer) => {
            try {
                const response = await fetch(`${env.be.url}/api/computer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(computer),
                });

                if (!response.ok) throw new Error('Failed to create a computer');
            } catch (error) {
                alertService.error(error instanceof Error ? error.message : String(error));
            }
        },
        updateById: async (computer_id, params) => {
            try {
                const response = await fetch(`${env.be.url}/api/computer/${computer_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(params),
                });

                if (!response.ok) throw new Error('Failed to update computer');
            } catch (error) {
                alertService.error(error instanceof Error ? error.message : String(error));
            }
        },
        deleteById: async (computer_id: string) => {
            try {
                const response = await fetch(`${env.be.url}/api/computer/${computer_id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (!response.ok) throw new Error('Failed to delete computer');

                computerStore.setState({
                    computers: computers?.filter(c => c.computer_id !== computer_id),
                });
            } catch (error) {
                alertService.error(error instanceof Error ? error.message : String(error));
            }
        },
    };
}
