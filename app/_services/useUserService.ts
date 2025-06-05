import { create } from "zustand";
import useAlertService from "./useAlertService";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { env } from "@/app/_helpers/config";

interface IUser {
    user_id?: string,
    username?: string,
    password?: string,
    role?: string,
}

interface IUserStore {
    user?: IUser,
    currentUser?: IUser,
}

interface IUserService extends IUserStore {
    login: (username: string, password: string) => Promise<void>,
    register: (username: string, password: string) => Promise<void>,
    logout: () => Promise<void>,
    getCurrent: (token: string) => Promise<void>,
}

const initialState = {
    user: undefined,
    currentUser: undefined,
}

const userStore = create<IUserStore>(() => initialState);

export default function useUserService(): IUserService {
    const alertService = useAlertService();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, currentUser } = userStore();

    return {
        user,
        currentUser,
        login: async (username, password) => {
            alertService.clear();
            try {
                const response = await fetch(`${env.be.url}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // important to send and receive cookies
                    body: JSON.stringify({ username, password }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Login failed');
                }
                //set current user
                const data = await response.json();
                userStore.setState({ ...initialState, currentUser: data.user });

                // login successful, cookies should be set by server (httpOnly cookies)
                const returnUrl = searchParams.get('returnUrl') || '/';
                router.push(returnUrl);

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
                alertService.error(
                    error instanceof Error ? error.message : String(error)
                );
            }
        },
        logout: async () => {
            try {
                await fetch(`${env.be.url}/api/auth/logout`, {
                    method: 'GET',
                    credentials: 'include',
                });
                router.push('/account/login');
            } catch (error) {
                alertService.error(
                    error instanceof Error ? error.message : String(error)
                );
            }
        },
        getCurrent: async (token: string) => {
            if (!token) return;
            try {
                const response = await fetch(`${env.be.url}/api/auth/status`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch current user status');
                }

                const data = await response.json();

                if (!userStore.getState().currentUser) {
                    userStore.setState({ currentUser: data.user });
                }
            } catch (error) {
                alertService.error(
                    error instanceof Error ? error.message : String(error)
                );
            }
        }
    }
}