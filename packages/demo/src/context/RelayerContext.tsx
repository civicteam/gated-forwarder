import {createContext, FC, PropsWithChildren, useContext, useMemo, useState} from "react";

type RelayerContextType = {
    setGelato: (gelato: boolean) => void;
    setCivic: (civic: boolean) => void;
    gelatoEnabled: boolean;
    civicEnabled: boolean;
}

const RelayerContext = createContext<RelayerContextType>({
    setGelato: () => {},
    setCivic: () => {},
    gelatoEnabled: false,
    civicEnabled: false,
});

export const RelayerProvider: FC<PropsWithChildren> = ({children}) => {
    const [gelatoEnabled, setGelato] = useState<boolean>(false);
    const [civicEnabled, setCivic] = useState<boolean>(false);

    return (
        <RelayerContext.Provider
            value={{
                gelatoEnabled,
                civicEnabled,
                setGelato,
                setCivic,
            }}
        >
            {children}
        </RelayerContext.Provider>
    );
}

export const useRelayerContext = () => useContext(RelayerContext);