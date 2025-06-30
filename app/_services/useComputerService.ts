import useAlertService from "./useAlertService"
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
    getAll: (token: string | null) => Promise<void>,
    getById: (computer_id: string, token: string | null) => Promise<void>,
    updateById: (computer_id: string, params: Partial<IComputer>, token: string | null) => Promise<void>,
    create: (computer: IComputer, token: string | null) => Promise<void>,
    deleteById: (computer_id: string, token: string | null) => Promise<void>,
}

const initialState = {
    computer: undefined,
    computers: undefined,
}

const computerStore = create<IComputerStore>(() => initialState);

export default function useComputerService(): IComputerService {
    const alertService = useAlertService();
    const { computer, computers } = computerStore();

    return {
        computer,
        computers,
        getAll: async (token: string | null) => {
            try {
                if (!token) {
                    alertService.error("Token missing");
                    return;
                }

                const response = await fetch(`${env.be.url}/api/computer/list/all`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }

                const data = await response.json();
                computerStore.setState({ computers: data.computers });
            } catch (error) {
                alertService.error(
                    error instanceof Error ? error.message : String(error)
                );
            }
        },
        getById: async (computer_id: string, token: string | null) => {
            if (!token) {
                alertService.error("Token missing");
                return;
            }
            computerStore.setState({ computer: undefined });
            try {
                const response = await fetch(`${env.be.url}/api/computer/${computer_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch a post`);
                }

                const data = await response.json();
                computerStore.setState({ computer: data.computer });
            } catch (error) {
                alertService.error(
                    error instanceof Error ? error.message : String(error)
                );
            }
        },
        create: async (computer: IComputer, token: string | null) => {
            if (!token) {
                alertService.error("Token missing");
                return;
            }
            try {
                const response = await fetch(`${env.be.url}/api/computer`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(computer),
                });

                if (!response.ok) {
                    throw new Error('Failed to create a computer');
                }
            } catch (error) {
                alertService.error(
                    error instanceof Error ? error.message : String(error)
                );
            }
        },
        updateById: async (computer_id, params, token: string | null) => {
            if (!token) {
                alertService.error("Token missing");
                return;
            }
            try {
                const response = await fetch(`${env.be.url}/api/computer/${computer_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(params),
                });

                if (!response.ok) {
                    throw new Error('Failed to update computer');
                }

            } catch (error) {
                alertService.error(
                    error instanceof Error ? error.message : String(error)
                );
            }
        },
        deleteById: async (computer_id: string, token: string | null) => {
            if (!token) {
                alertService.error("Token missing");
                return;
            }
            try {
                const response = await fetch(`${env.be.url}/api/computer/${computer_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete computer');
                }
                computerStore.setState({
                    computers: computers?.filter(computer => computer.computer_id !== computer_id),
                });
            } catch (error) {
                alertService.error(
                    error instanceof Error ? error.message : String(error)
                );
            }
        }
    }
}