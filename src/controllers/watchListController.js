const SchedulerService = require('../services/schedulerService');

const schedulerService = new SchedulerService(
  process.env.RPC_URL,
  process.env.SLACK_WEBHOOK_URL
);

// Start the scheduler when the controller is initialized
schedulerService.startScheduler();

const addToWatchList = async (req, res, next) => {
  try {
    const { contractAddress, tokenId, walletAddress, label } = req.body;

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

    await schedulerService.addToWatchList({
      contractAddress,
      tokenId,
      walletAddress,
      label
    });

    res.json({
      message: 'Added to watch list',
      item: {
        contractAddress,
        tokenId,
        walletAddress,
        label
      }
    });
  } catch (error) {
    next(error);
  }
};

const removeFromWatchList = async (req, res, next) => {
  try {
    const { contractAddress, tokenId, walletAddress } = req.body;

    // Validate required parameters
    if (!contractAddress || !tokenId || !walletAddress) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['contractAddress', 'tokenId', 'walletAddress']
      });
    }

    await schedulerService.removeFromWatchList(contractAddress, tokenId, walletAddress);

    res.json({
      message: 'Removed from watch list',
      item: {
        contractAddress,
        tokenId,
        walletAddress
      }
    });
  } catch (error) {
    next(error);
  }
};

const getWatchList = async (req, res, next) => {
  try {
    const watchList = schedulerService.getWatchList();
    res.json(watchList);
  } catch (error) {
    next(error);
  }
};

const checkBalancesNow = async (req, res, next) => {
  try {
    const { results, errors } = await schedulerService.checkAllBalances();
    res.json({ results, errors });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToWatchList,
  removeFromWatchList,
  getWatchList,
  checkBalancesNow
}; 