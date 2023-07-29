# Civic Gelato Gated Forwarder

## The principle

The dApp creates a transaction `T`: 

```
T = { from, to, data, value, ... }
```

T is converted to an ERC712 Typed Data message and signed, resulting in:

```
request: T
signature: string
```

This is sent to the ERC2771 Forwarder, which verifies that the signature matches the request.

It then passes the request data (`T.data`) and the original sender of the
message (`T.from`) to the gated forwarder via encodePacked.

The gated forwarder extracts the original sender again (`T.from`), and verifies that they
have a pass using the `GatedERC2771` 