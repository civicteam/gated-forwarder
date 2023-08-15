import {type PublicClient, useChainId, usePublicClient, useWalletClient, WalletClient} from 'wagmi'
import {FallbackProvider, JsonRpcProvider, Web3Provider} from '@ethersproject/providers'
import {type HttpTransport} from 'viem'
import {useMemo} from "react";

export function publicClientToProvider(publicClient: PublicClient) {
    const { chain, transport } = publicClient
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    if (transport.type === 'fallback')
        return new FallbackProvider(
            (transport.transports as ReturnType<HttpTransport>[]).map(
                ({ value }) => new JsonRpcProvider(value?.url, network),
            ),
        )
    return new JsonRpcProvider(transport.url, network)
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersPublicProvider() {
    const chainId = useChainId();
    const publicClient = usePublicClient({ chainId })
    return useMemo(() => publicClientToProvider(publicClient), [publicClient])
}

export function walletClientToProvider(walletClient: WalletClient) {
    const { account, chain, transport } = walletClient
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    return new Web3Provider(transport, network)
}

export function walletClientToSigner(walletClient: WalletClient) {
    const provider = walletClientToProvider(walletClient)
    return provider.getSigner(walletClient.account.address)
}

export function useEthersSignerProvider() {
    const chainId = useChainId();
    const { data: walletClient } = useWalletClient({ chainId })
    return useMemo(() => !!walletClient ? walletClientToProvider(walletClient) : undefined, [walletClient])
}


/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner() {
    const chainId = useChainId();
    const { data: walletClient } = useWalletClient({ chainId })
    return useMemo(
        () => (walletClient ? walletClientToSigner(walletClient) : undefined),
        [walletClient],
    )
}
