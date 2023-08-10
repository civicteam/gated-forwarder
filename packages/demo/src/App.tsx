import {Content} from "./components/Content";
import {Title} from "./components/Title";
import {Web3Button} from "@web3modal/react";
import React from "react";
import {GelatoToggle} from "./components/GelatoToggle";
import {CivicToggle} from "./components/CivicToggle";

export function App() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-300 flex justify-center items-center">
            <div className="w-3/4 bg-blue-50 rounded-lg shadow-lg p-8 m-4 relative">
                <Title />
                <div className="absolute top-8 left-8 flex items-center space-x-4">
                    <CivicToggle />
                    <GelatoToggle />
                </div>
                <div className="absolute top-8 right-8 flex items-center space-x-4">
                    <Web3Button />
                </div>
                <Content />
            </div>
        </div>
    )
}
