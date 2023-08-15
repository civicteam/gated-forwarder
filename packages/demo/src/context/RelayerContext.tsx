import {createContext, FC, PropsWithChildren, useContext, useMemo, useReducer, useState} from "react";

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

type State = {
    gelatoEnabled: boolean;
    civicEnabled: boolean;
}
type Action = {
    type: "setGelato" | "setCivic";
    payload: boolean;
}

export const RelayerProvider: FC<PropsWithChildren> = ({children}) => {
    const [ state, dispatch ] = useReducer((state: State, action: Action) => {
        switch (action.type) {
            case "setGelato":
                return {
                    ...state,
                    gelatoEnabled: action.payload,
                }
            case "setCivic":
                return {
                    ...state,
                    civicEnabled: action.payload,
                    gelatoEnabled: action.payload ? true : state.gelatoEnabled,
                }
        }
    }, {
        gelatoEnabled: false,
        civicEnabled: false,
    });

    return (
        <RelayerContext.Provider
            value={{
                gelatoEnabled: state.gelatoEnabled,
                civicEnabled: state.civicEnabled,
                setGelato: (gelatoEnabled: boolean ) => dispatch({ type: "setGelato", payload: gelatoEnabled }),
                setCivic: (civicEnabled: boolean ) => dispatch({ type: "setCivic", payload: civicEnabled }),
            }}
        >
            {children}
        </RelayerContext.Provider>
    );
}

export const useRelayerContext = () => useContext(RelayerContext);