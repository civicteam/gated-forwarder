import {useRelayerContext} from "../context/RelayerContext";
import {IdentityButton} from "@civic/ethereum-gateway-react";

export const CivicToggle = () => {
    const { setCivic, civicEnabled } = useRelayerContext();
    return (
        <div className="form-control">
            <label className="label cursor-pointer flex space-x-4">
                <span className={`label-text badge text-white ${civicEnabled ? "badge-primary" : "badge-neutral"}`}>Civic</span>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked={civicEnabled} onClick={
                    () => {
                        setCivic(!civicEnabled);
                    }
                } />
                { civicEnabled && <IdentityButton />}
            </label>
        </div>
    )
}