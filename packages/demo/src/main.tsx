import { EthereumClient } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { WagmiConfig } from 'wagmi'

import { App } from './App'
import { chains, config, walletConnectProjectId } from './wagmi'
import {BoardProvider} from "./context/BoardContext";

import './index.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RelayerProvider} from "./context/RelayerContext";
import {GatewayProvider} from "@civic/ethereum-gateway-react";
import {CivicWrapper} from "./components/CivicWrapper";

const ethereumClient = new EthereumClient(config, chains)
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <WagmiConfig config={config}>
                <CivicWrapper>
                    <RelayerProvider>
                        <BoardProvider>
                            <App />
                            <Web3Modal
                                projectId={walletConnectProjectId}
                                ethereumClient={ethereumClient}
                            />
                        </BoardProvider>
                    </RelayerProvider>
                </CivicWrapper>
            </WagmiConfig>
        </QueryClientProvider>
    </React.StrictMode>,
)
