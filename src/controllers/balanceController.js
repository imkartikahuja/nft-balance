const Web3Service = require('../services/web3Service');

const web3Service = new Web3Service(process.env.RPC_URL);

const getBalance = async (req, res, next) => {
  try {
    const { contractAddress, tokenId, walletAddress } = req.query;

    // Validate required parameters
    if (!contractAddress || !tokenId || !walletAddress) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['contractAddress', 'tokenId', 'walletAddress']
      });
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress) || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({
        error: 'Invalid Ethereum address format'
      });
    }

    // Validate tokenId is a number
    if (isNaN(tokenId)) {
      return res.status(400).json({
        error: 'Token ID must be a number'
      });
    }

    const balance = await web3Service.getBalance(contractAddress, tokenId, walletAddress);

    res.json({
      contractAddress,
      tokenId,
      walletAddress,
      balance: balance.toString()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBalance
}; 