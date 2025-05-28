# Watchlist Documentation

The watchlist feature allows you to monitor multiple ERC1155 NFT balances automatically. This document provides detailed examples and use cases.

## Basic Usage

### Adding NFTs to Watchlist

```bash
curl -X POST http://localhost:8012/watch \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0x1234567890123456789012345678901234567890",
    "tokenId": 1,
    "walletAddress": "0x0987654321098765432109876543210987654321",
    "label": "My Cool NFT"
  }'
```

### Example Use Cases

1. **Monitoring Multiple NFTs**
```json
[
  {
    "contractAddress": "0x1234...7890",
    "tokenId": 1,
    "walletAddress": "0x0987...4321",
    "label": "Cool NFT #1"
  },
  {
    "contractAddress": "0x1234...7890",
    "tokenId": 2,
    "walletAddress": "0x0987...4321",
    "label": "Cool NFT #2"
  }
]
```

2. **Monitoring Different Collections**
```json
[
  {
    "contractAddress": "0x1234...7890",
    "tokenId": 1,
    "walletAddress": "0x0987...4321",
    "label": "Collection A - NFT #1"
  },
  {
    "contractAddress": "0x5678...1234",
    "tokenId": 1,
    "walletAddress": "0x0987...4321",
    "label": "Collection B - NFT #1"
  }
]
```

## API Examples

### 1. Add to Watchlist
```bash
curl -X POST http://localhost:8012/watch \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0x1234567890123456789012345678901234567890",
    "tokenId": 1,
    "walletAddress": "0x0987654321098765432109876543210987654321",
    "label": "My Cool NFT"
  }'
```

Response:
```json
{
  "message": "Added to watch list",
  "item": {
    "contractAddress": "0x1234567890123456789012345678901234567890",
    "tokenId": 1,
    "walletAddress": "0x0987654321098765432109876543210987654321",
    "label": "My Cool NFT"
  }
}
```

### 2. Get Watchlist
```bash
curl -X GET http://localhost:8012/watch
```

Response:
```json
[
  {
    "contractAddress": "0x1234567890123456789012345678901234567890",
    "tokenId": 1,
    "walletAddress": "0x0987654321098765432109876543210987654321",
    "label": "My Cool NFT"
  },
  {
    "contractAddress": "0x5678901234567890123456789012345678901234",
    "tokenId": 2,
    "walletAddress": "0x0987654321098765432109876543210987654321",
    "label": "Another NFT"
  }
]
```

### 3. Remove from Watchlist
```bash
curl -X DELETE http://localhost:8012/watch \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0x1234567890123456789012345678901234567890",
    "tokenId": 1,
    "walletAddress": "0x0987654321098765432109876543210987654321"
  }'
```

Response:
```json
{
  "message": "Removed from watch list",
  "item": {
    "contractAddress": "0x1234567890123456789012345678901234567890",
    "tokenId": 1,
    "walletAddress": "0x0987654321098765432109876543210987654321"
  }
}
```

### 4. Check Balances Now
```bash
curl -X POST http://localhost:8012/watch/check-now
```

Response:
```json
{
  "results": [
    {
      "contractAddress": "0x1234567890123456789012345678901234567890",
      "tokenId": 1,
      "walletAddress": "0x0987654321098765432109876543210987654321",
      "balance": "5"
    },
    {
      "contractAddress": "0x5678901234567890123456789012345678901234",
      "tokenId": 2,
      "walletAddress": "0x0987654321098765432109876543210987654321",
      "balance": "1"
    }
  ],
  "errors": []
}
```

## Best Practices

1. **Use Labels**
   - Always provide meaningful labels for easy identification
   - Include collection name and token ID in the label
   - Example: "Bored Ape #1234" or "Cool Collection - Token #5678"

2. **Error Handling**
   - Check the `errors` array in the response when checking balances
   - Handle network errors gracefully
   - Implement retry logic for failed balance checks

3. **Monitoring**
   - Use the health check endpoint to monitor service status
   - Set up alerts for balance changes
   - Monitor the service logs for any issues

## Common Scenarios

### 1. Monitoring Multiple Wallets
```json
[
  {
    "contractAddress": "0x1234...7890",
    "tokenId": 1,
    "walletAddress": "0x1111...1111",
    "label": "Wallet 1 - NFT #1"
  },
  {
    "contractAddress": "0x1234...7890",
    "tokenId": 1,
    "walletAddress": "0x2222...2222",
    "label": "Wallet 2 - NFT #1"
  }
]
```

### 2. Monitoring Different Token IDs
```json
[
  {
    "contractAddress": "0x1234...7890",
    "tokenId": 1,
    "walletAddress": "0x0987...4321",
    "label": "Token ID 1"
  },
  {
    "contractAddress": "0x1234...7890",
    "tokenId": 2,
    "walletAddress": "0x0987...4321",
    "label": "Token ID 2"
  }
]
```

### 3. Monitoring Multiple Collections
```json
[
  {
    "contractAddress": "0x1234...7890",
    "tokenId": 1,
    "walletAddress": "0x0987...4321",
    "label": "Collection A - Token #1"
  },
  {
    "contractAddress": "0x5678...1234",
    "tokenId": 1,
    "walletAddress": "0x0987...4321",
    "label": "Collection B - Token #1"
  }
]
```

## Error Responses

### Invalid Address Format
```json
{
  "error": "Invalid Ethereum address format"
}
```

### Missing Parameters
```json
{
  "error": "Missing required parameters",
  "required": ["contractAddress", "tokenId", "walletAddress"]
}
```

### Invalid Token ID
```json
{
  "error": "Token ID must be a number"
}
``` 