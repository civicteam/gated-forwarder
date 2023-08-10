import { useNetwork, useSwitchNetwork } from 'wagmi'

export function NetworkSwitcher() {
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()

  return (
      <div className="space-y-4">
          {chains.map((x) => (
              <button
                  key={x.id}
                  onClick={() => !!switchNetwork && switchNetwork(x.id)}
                  className={`btn text-white py-2 px-4 rounded-md ${
                      x.id === chain?.id
                          ? 'btn-primary'
                          : 'bg-primary-400 hover:bg-primary-500'
                  }`}
              >
                  {x.name}
                  {isLoading && x.id === pendingChainId && ' (switching)'}
              </button>
          ))}
          {error?.message && <div className="text-red-500">{error?.message}</div>}
      </div>
  )
}
