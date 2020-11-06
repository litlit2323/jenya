import {useCallback, useEffect} from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import {userFetcher} from "@utils/fetchJson"
import {useQuery} from 'react-query'
import axios from "@utils/axios";

export default function useUser({redirectTo = false, redirectIfFound = false} = {}) {
    const {data: user, mutateUser} = useSWR('/api/user/account', userFetcher)

    return {user, mutateUser}

}



