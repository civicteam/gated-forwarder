import {boardContractConfig} from "../components/contracts";
import {useContractRead} from "wagmi";

export const useBoardGetPostCount = () => {
    const { data  } =
        useContractRead({
            ...boardContractConfig,
            functionName: 'getPostsCount',
            watch: true
        })

    return data;
}