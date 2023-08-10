import { w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig } from 'wagmi'
import { polygon, polygonMumbai, foundry } from 'wagmi/chains'
import {  } from '@wagmi/core/connectors'

export const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [foundry, polygon, ...(import.meta.env?.MODE === 'development' ? [polygonMumbai] : [])],
  [w3mProvider({ projectId: walletConnectProjectId })],
)

export const config = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    chains,
    projectId: walletConnectProjectId,
  }),
  publicClient,
  webSocketPublicClient,
})

export { chains }
