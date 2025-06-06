const cron = require('node-cron');
const Web3Service = require('./web3Service');
const SlackService = require('./slackService');
const { saveWatchList, loadWatchList } = require('../utils/fileUtils');

class SchedulerService {
  constructor(rpcUrl, slackWebhookUrl) {
    this.web3Service = new Web3Service(rpcUrl);
    this.slackService = new SlackService(slackWebhookUrl);
    this.watchList = new Map(); // Map to store watch configurations
    this.initializeWatchList();
  }

  // Initialize watch list from file
  async initializeWatchList() {
    try {
      this.watchList = await loadWatchList();
      console.log('Watch list loaded from file');
    } catch (error) {
      console.error('Error loading watch list:', error);
      this.watchList = new Map();
    }
  }

  // Add a new NFT to watch
  async addToWatchList(config) {
    const { contractAddress, tokenId, walletAddress, label } = config;
    const key = `${contractAddress}-${tokenId}-${walletAddress}`;
    
    if (!this.watchList.has(key)) {
      this.watchList.set(key, {
        contractAddress,
        tokenId,
        walletAddress,
        label: label || key,
        lastBalance: null,
        lastChecked: null,
        lastNotificationSent: null
      });
      
      // Save to file after adding
      await this.saveWatchList();
    }
  }

  // Remove an NFT from watch list
  async removeFromWatchList(contractAddress, tokenId, walletAddress) {
    const key = `${contractAddress}-${tokenId}-${walletAddress}`;
    this.watchList.delete(key);
    
    // Save to file after removing
    await this.saveWatchList();
  }

  // Get current watch list
  getWatchList() {
    return Array.from(this.watchList.values());
  }

  // Save watch list to file
  async saveWatchList() {
    try {
      await saveWatchList(this.watchList);
    } catch (error) {
      console.error('Error saving watch list:', error);
    }
  }

  // Check if we should send a notification
  shouldSendNotification(config, newBalance) {
    const BALANCE_THRESHOLD = 500;
    const NOTIFICATION_COOLDOWN = 1 * 60 * 60 * 1000; // 1 hours in milliseconds

    // Check if balance is below threshold
    if (parseInt(newBalance) > BALANCE_THRESHOLD) {
      return false;
    }

    // Check if we've sent a notification recently
    if (config.lastNotificationSent) {
      const timeSinceLastNotification = Date.now() - new Date(config.lastNotificationSent).getTime();
      if (timeSinceLastNotification < NOTIFICATION_COOLDOWN) {
        return false;
      }
    }

    return true;
  }

  // Check balances for all watched NFTs
  async checkAllBalances() {
    const results = [];
    const errors = [];

    for (const [key, config] of this.watchList) {
      try {
        const balance = await this.web3Service.getBalance(
          config.contractAddress,
          config.tokenId,
          config.walletAddress
        );

        const result = {
          label: config.label,
          contractAddress: config.contractAddress,
          tokenId: config.tokenId,
          walletAddress: config.walletAddress,
          balance: balance.toString(),
          timestamp: new Date().toISOString()
        };

        // Check if we should send a notification
        if (this.shouldSendNotification(config, balance.toString())) {
          await this.slackService.sendLowBalanceAlert(result);
          config.lastNotificationSent = new Date().toISOString();
        }

        // Update last known balance
        config.lastBalance = balance.toString();
        config.lastChecked = new Date();

        results.push(result);
        console.log(`Checked balance for ${config.label}: ${balance}`);
      } catch (error) {
        errors.push({
          label: config.label,
          error: error.message
        });
        console.error(`Error checking balance for ${config.label}:`, error.message);
      }
    }

    // Save watch list after updating balances
    await this.saveWatchList();

    return { results, errors };
  }

  // Start the scheduler
  startScheduler() {
    // Run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      console.log('Running scheduled balance check...');
      const { results, errors } = await this.checkAllBalances();
      
      if (errors.length > 0) {
        console.error('Errors during balance check:', errors);
      }
    });

    console.log('Scheduler started - checking balances every 5 minutes');
  }
}

module.exports = SchedulerService; 