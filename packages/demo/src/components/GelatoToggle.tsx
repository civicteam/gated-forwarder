import {useRelayerContext} from "../context/RelayerContext";

export const GelatoToggle = () => {
    const { setGelato, gelatoEnabled } = useRelayerContext();
    return (
        <div className="form-control">
            <label className="label cursor-pointer flex space-x-4">
                <span className={`label-text badge text-white ${gelatoEnabled ? "badge-primary" : "badge-neutral"}`}>Gelato</span>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked={gelatoEnabled} onClick={
                    () => {
                        setGelato(!gelatoEnabled);
                    }
                } />
            </label>
        </div>
    )
}