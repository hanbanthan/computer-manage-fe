import { create } from "zustand";
import useAlertService from "./useAlertService";
import useFetch from "../_helpers/client/useFetch";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { env } from "@/app/_helpers/config";

interface IUser {
    username: string,
    password: string,
}

interface IUserStore {
    user?: IUser,
    currentUser?: IUser,
}

interface IUserService extends IUserStore {
    login: (username: string, password: string) => Promise<void>,
    register: (user: IUser) => Promise<void>,
    getCurrent: () => Promise<void>,
}

const initialState = {
    user: undefined,
    currentUser: undefined,
}

const userStore = create<IUserStore>(() => initialState);

export default function useUserService(): IUserService {
    const alertService = useAlertService();
    const fetch = useFetch();
    const router = useRouter();
    const searhParams = useSearchParams();
    const { user, currentUser } = userStore();

    return {
        user,
        currentUser,
        login: async (username, password) => {
            alertService.clear();
            try {
                const response = await fetch.post(`${env.be.url}/api/auth/login`, { username, password });
                const { accessToken } = response;

                localStorage.setItem('accessToken', accessToken);

                //get return url from query parameters or default to '/'
                const returnUrl = searhParams.get('returnUrl') || '/';
                router.push(returnUrl);
            } catch (error) {
                alertService.error(
                    error instanceof Error ? error.message : String(error)
                );
            }
        },
        register: async (user: IUser) => {
            try {
                await fetch.post(`${env.be.url}/api/auth/register`, user);
                alertService.success('Registration successful', true);
                router.push('/account/login');
            } catch (error) {
                alertService.error(
                    error instanceof Error ? error.message : String(error)
                );
            }
        },
        getCurrent: async () => {
            const response = await fetch.get(`${env.be.url}/api/auth/status`);
            if (!currentUser) {
                userStore.setState({ currentUser: response.user});
            }
        }
    }
}