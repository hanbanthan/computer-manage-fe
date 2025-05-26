import { headers } from "next/headers";
import { useRouter } from "next/navigation";

export default function useFetch() {
    const router = useRouter();

    async function handleResponse(response: any) {
        const isJson = response.headers?.get('content-type')?.includes('application/json');
        const data = isJson ? await response.json() : null;

        if (!response.ok) {
            if (response.status === 401) {
                router.push('/account/login');
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    }

    function request(method: string) {
        return (url: string, body?: any) => {
            const token = localStorage.getItem('accessToken');
            const requestOptions: any = {
                method,
                headers: {
                    ...(body && { 'Content-Type': 'application/json' }),
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                ...(body && { body: JSON.stringify(body) })
            };
            return fetch(url, requestOptions).then(handleResponse);
        }
    }

    return {
        get: request('GET'),
        post: request('POST'),
        patch: request('PATCH'),
        put: request('PUT'),
        delete: request('DELETE')
    };
}