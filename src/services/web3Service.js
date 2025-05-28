const { Web3 } = require('web3');

// ERC1155 ABI for balanceOf function
const ERC1155_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

class Web3Service {
  constructor(rpcUrl) {
    this.web3 = new Web3(rpcUrl);
  }

  async getBalance(contractAddress, tokenId, walletAddress) {
    try {
      const contract = new this.web3.eth.Contract(ERC1155_ABI, contractAddress);
      const balance = await contract.methods.balanceOf(walletAddress, tokenId).call();
      return balance;
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }
}

module.exports = Web3Service; 