import {useAccount, useBalance} from 'wagmi'

import { NetworkSwitcher } from './NetworkSwitcher'
import {WritePost} from "./board/WritePost";
import {useBoardGetPostCount} from "../hooks/useBoardGetPostCount";
import {Posts} from "./board/Posts";

export function Content() {
    const { isConnected, address } = useAccount()
    const count = useBoardGetPostCount()
    const bal = useBalance({ address });

    if (!isConnected) return <></>

    return (
        <>
            <NetworkSwitcher />
            <br />
            <div>Balance: {bal?.data?.formatted} ETH</div>
            <br />
            <WritePost />
            <Posts />
            <div>posts: { count?.toString() }</div>
        </>
    )
}
