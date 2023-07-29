# Civic Gelato Gated Forwarder

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