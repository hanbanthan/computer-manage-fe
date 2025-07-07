import { create } from "zustand";
import useAlertService from "./useAlertService";
import { useRouter } from "next/navigation";
import { env } from "@/app/_helpers/config";

interface IUser {
    user_id?: string,
    username?: string,
    password?: string,
    role?: string,
}

interface IUserStore {
    user?: IUser,
    users?: IUser[],
    currentUser?: IUser,
}

interface IUserService extends IUserStore {
    login: (username: string, password: string) => Promise<void>,
    register: (username: string, password: string) => Promise<void>,
    logout: () => Promise<void>,
    getCurrent: () => Promise<void>,
    getAllUsers: () => Promise<void>,
    createNewAdmin: (username: string, password: string) => Promise<void>,
    deleteUser: (user_id: string) => Promise<void>,
    changeRole: (user_id: string, new_role: string) => Promise<void>,
}

const initialState = {
    user: undefined,
    currentUser: undefined,
    users: undefined,
};

const userStore = create<IUserStore>(() => initialState);

export default function useUserService(): IUserService {
    const alertService = useAlertService();
    const router = useRouter();
    const { user, users, currentUser } = userStore();

    return {
        user,
        users,
        currentUser,
        login: async (username, password) => {
            alertService.clear();
            try {
                const response = await fetch(`${env.be.url}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ username, password }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Login failed');
                }

                const data = await response.json();
                userStore.setState({ ...initialState, currentUser: data.user });
                router.push('/');
            } catch (error) {
                alertService.error(error instanceof Error ? error.message : String(error));
            }
        },
        register: async (username: string, password: string) => {
            try {
                await fetch(`${env.be.url}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });
                alertService.success('Registration successful', true);
                router.push('/account/login');
            } catch (error) {
                alertService.error(error instanceof Error ? error.message : String(error));
            }
        },
        logout: async () => {
            try {
                await fetch(`${env.be.url}/api/auth/logout`, {
                    method: 'GET',
                    credentials: 'include',
                });
                userStore.setState({ ...initialState });
                router.push('/account/login');
            } catch (error) {
                alertService.error(error instanceof Error ? error.message : String(error));
            }
        },
        getCurrent: async () => {
            try {
                const response = await fetch(`${env.be.url}/api/auth/status`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) throw new Error('Failed to fetch current user');

                const data = await response.json();
                userStore.setState({ currentUser: data.user });
            } catch (error) {
                alertService.error(error instanceof Error ? error.message : String(error));
            }
        },
        getAllUsers: async () => {
            try {
                const response = await fetch(`${env.be.url}/api/admin-auth/user/list-all`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) throw new Error('Failed to fetch users');

                const data = await response.json();
                userStore.setState({ users: data.users });
            } catch (error) {
                alertService.error(error instanceof Error ? error.message : String(error));
            }
        },
        createNewAdmin: async (username: string, password: string) => {
            const response = await fetch(`${env.be.url}/api/superadmin-auth/create-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) throw new Error('Failed to create admin');
        },
        deleteUser: async (user_id: string) => {
            try {
                const response = await fetch(`${env.be.url}/api/admin-auth/delete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ user_id }),
                });

                if (!response.ok) throw new Error('Failed to delete user');

                userStore.setState({
                    users: users?.filter(user => user.user_id !== user_id),
                });
            } catch (error) {
                alertService.error(error instanceof Error ? error.message : String(error));
            }
        },
        changeRole: async (user_id: string, new_role: string) => {
            try {
                const response = await fetch(`${env.be.url}/api/superadmin-auth/change-role`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ user_id, new_role }),
                });

                if (!response.ok) throw new Error('Failed to change role');

                const updatedUsers = users?.map((user) =>
                    user.user_id === user_id ? { ...user, role: new_role } : user
                );

                userStore.setState({ users: updatedUsers });
            } catch (error) {
                alertService.error(error instanceof Error ? error.message : String(error));
            }
        },
    };
}
