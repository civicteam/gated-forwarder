import {Content} from "./components/Content";
import {Title} from "./components/Title";
import {Web3Button} from "@web3modal/react";
import React from "react";
import {GelatoToggle} from "./components/GelatoToggle";
import {CivicToggle} from "./components/CivicToggle";

export function App() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-300 flex justify-center items-center">
            <div className="w-3/4 bg-blue-50 rounded-lg shadow-lg">
                <div className="flex justify-between items-center h-16 m-2">
                    {/* Left */}
                    <div className="flex items-center space-x-4 w-1/4 mr-4">
                        <GelatoToggle />
                        <CivicToggle />
                    </div>

                    {/* Center */}
                    <div className="mx-auto text-center">
                        <Title />
                    </div>

                    {/* Right */}
                    <div className="w-1/4 text-right">
                        <Web3Button />
                    </div>
                </div>
                <Content />
            </div>
        </div>
    )
}
