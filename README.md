# Civic Gated Forwarder

This tool uses [Civic Pass](www.civic.com) and [Gelato Relay](relay.gelato.network)
to allow dApps to offer gasless transaction to users only once they have
proven their personhood.

## The principle

Given the following actors and contracts:

- User wallet `U`,
- ERC2771-forwarder relay contract `R`,
- Gated forwarder contract `G`
- Target contract `T`

`T` must implement `ERC2771Context` and trust `G`,
`G` is also an `ERC2771Context` contract and trusts `R`.

This leads to a chain of trust from `R -> G -> T`.

### Creating a gated transaction

The dApp creates a transaction `tx`: 

```
tx = { from, to, value, data, ... }
```

where:

- `from` is the user wallet `U`.
- `to` is the gated forwarder contract `G`
- `value` is the eth amount to be sent to `T`
- `data` is a tuple: `(T, target_data)`, where `target_data` is the data to be sent to `T`

`tx` is converted to an ERC712 Typed Data message and signed, resulting in:

```
request: tx
signature: string
```

This is sent to `R`, which verifies that the signature matches the request.

It then passes the request data (`tx.data`) and the original sender of the
message (`tx.from`) to the gated forwarder via encodePacked.

The gated forwarder extracts the original sender again (`tx.from`), and verifies that they
have a pass using the `GatedERC2771`

## Steps to use from scratch

1. Create a new deployer wallet and fund it

The deployer wallet will be used to deploy the factory, which in turn will be
used to deploy the gated forwarders themselves.

The forwarder addresses are deterministic (using CREATE2) and are derived from the factory address
However, the factory address is not deterministic and depend on the nonce of the deployer wallet.

Therefore, in order that the CREATE2 addresses of the forwarders be predictable across
all chains, it is recommended that the deployer wallet for the factory be a fresh wallet, and that
the first transaction (nonce 0) be the deployment of the factory.

2. Deploy the factory

Copy .env.example to .env

Set the private key of the deployer wallet in .env

Set RPC urls for the chain you are deploying to

Run `yarn deploy-forwarder-factory <CHAIN>`

Record the factory contract address in .env

3. Deploy a gated forwarder

Run `source .env`

Run `yarn deploy-forwarder <GKN_ID>`

where `GKN_ID` is the gatekeeper network slot ID (integer)

Note: This script deploys to polygon mumbai.
Edit the script in package.json to deploy to a different chain.
(yarn scripts do not allow positional arguments)

4. Verify the forwarder implementation

Run `yarn verify-implementation`

Note: This script uses mumbai and polygonscan. Edit the script in package.json
to use a different chain and explorer. Remember to add the API key in .env

5. Add Gelato as a trusted forwarder to the gated forwarder

Run `yarn add-gelato <FORWARDER_ADDRESS>`

where `FORWARDER_ADDRESS` is the address of the gated forwarder
deployed in step 3.

6. Set up Gelato Relay

6a. Create and fund a new app on relay.gelato.network

Follow [these steps](https://docs.gelato.network/developer-services/relay) for more details.

6b. Add the gated forwarder address, enabling the `execute` function

7. Set up your dApp

The dApp must:
- import the relay SDK
- import @civic/ethereum-gateway-react
- import @civic/gelato-client

See [useGelato.ts](packages%2Fdemo%2Fsrc%2Fhooks%2FuseGelato.ts) for an example.