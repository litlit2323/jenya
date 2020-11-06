import useSWR from "swr"
import {userFetcher} from "@utils/fetchJson"
import {useEffect} from "react"
import Router from "next/router"
import axios from "@utils/axios"
import useUser from "@utils/useUser"
import React from "react"

const useFixedSWR = (key, fetcher, {initialData, ...config} = {}) => {
    const initial = React.useRef(initialData);
    React.useEffect(() => {
        if (key) {
            initial.current = undefined;
        }
    }, [key]);
    return useSWR(key, fetcher, {...config, initialData: initial.current});
}

export default function useAdmin({redirectTo = false, redirectIfFound=false} = {}) {
    //Деструктуриуем из запроса данные, о том, является ли пользователь админом.
    const {data: user, mutate} = useSWR('/api/admin/checkPermissions', async (url) => axios.get(url).then(res => res.data.user).catch(error => error.response.data.user))
    useEffect(() => {
        if (!redirectTo || !user) {
            return
        }

        if (
            (redirectTo && !redirectIfFound && !user?.isAdmin) ||
            (redirectIfFound && user?.isAdmin)
        ) {
            Router.push(redirectTo)
        }
    }, [user, redirectIfFound, redirectTo])

    return {isAdmin: true, mutate}
}