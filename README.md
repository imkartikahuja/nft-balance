# NFT Balance Checker Microservice

A Node.js microservice for checking ERC1155 NFT balances using Web3.js. This service provides both real-time balance checking and a watch list feature with scheduled balance monitoring.

## Features

- Real-time ERC1155 NFT balance checking
- Watch list management for multiple NFTs
- Scheduled balance monitoring
- Slack notifications for balance changes
- Health check endpoint
- Input validation and error handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
RPC_URL=YOUR_ETHEREUM_RPC_URL
SLACK_WEBHOOK_URL=YOUR_SLACK_WEBHOOK_URL
```

Replace:
- `YOUR_ETHEREUM_RPC_URL` with your Ethereum node RPC URL (e.g., Infura, Alchemy, or your own node)
- `YOUR_SLACK_WEBHOOK_URL` with your Slack webhook URL for notifications (optional)

## Running the Service

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Production Deployment

### Prerequisites
- Node.js 14.x or higher
- PM2 globally installed (`npm install -g pm2`)

### Deployment Steps

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env` file:
```
PORT=3000
RPC_URL=YOUR_ETHEREUM_RPC_URL
SLACK_WEBHOOK_URL=YOUR_SLACK_WEBHOOK_URL
```

3. Start the service using PM2:
```bash
# Start the service
pm2 start ecosystem.config.js --env production

# Other useful PM2 commands:
pm2 status                    # Check service status
pm2 logs nft-balance-checker  # View logs
pm2 stop nft-balance-checker  # Stop the service
pm2 restart nft-balance-checker # Restart the service
```

4. Setup PM2 to start on system boot:
```bash
pm2 startup
pm2 save
```

### Production Configuration

The service is configured to run in production with the following optimizations:
- Cluster mode with maximum instances (utilizes all CPU cores)
- Automatic restart on crashes
- Memory limit of 1GB per instance
- No file watching (disabled for production)
- Environment-specific configuration

## API Endpoints

### Check NFT Balance
```
GET /balance?contractAddress=0x...&tokenId=1&walletAddress=0x...
```

Parameters:
- `contractAddress`: ERC1155 contract address
- `tokenId`: Token ID to check
- `walletAddress`: Wallet address to check balance for

Example Response:
```json
{
  "contractAddress": "0x...",
  "tokenId": "1",
  "walletAddress": "0x...",
  "balance": "5"
}
```

### Watch List Management

#### Add to Watch List
```
POST /watch
```

Request Body:
```json
{
  "contractAddress": "0x...",
  "tokenId": "1",
  "walletAddress": "0x...",
  "label": "Optional label for this watch item"
}
```

#### Remove from Watch List
```
DELETE /watch
```

Request Body:
```json
{
  "contractAddress": "0x...",
  "tokenId": "1",
  "walletAddress": "0x..."
}
```

#### Get Watch List
```
GET /watch
```

Response:
```json
[
  {
    "contractAddress": "0x...",
    "tokenId": "1",
    "walletAddress": "0x...",
    "label": "Optional label"
  }
]
```

#### Check All Watch List Balances Now
```
POST /watch/check-now
```

Response:
```json
{
  "results": [
    {
      "contractAddress": "0x...",
      "tokenId": "1",
      "walletAddress": "0x...",
      "balance": "5"
    }
  ],
  "errors": []
}
```

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok"
}
```

## Error Handling

The service includes validation for:
- Required parameters
- Ethereum address format
- Token ID format

Error responses will include a descriptive message and appropriate HTTP status code.

## Features in Detail

### Real-time Balance Checking
- Instant balance checking for any ERC1155 NFT
- Input validation for all parameters
- Proper error handling and response formatting

### Watch List Management
- Add multiple NFTs to watch
- Remove NFTs from watch list
- View current watch list
- Optional labels for better organization
- Manual trigger for immediate balance checking

### Scheduled Monitoring
- Automatic balance checking for watch list items
- Slack notifications for balance changes
- Error handling and reporting

## Development

The service is built with:
- Node.js
- Express.js
- Web3.js
- dotenv for environment configuration
- CORS enabled for cross-origin requests