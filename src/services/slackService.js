const { IncomingWebhook } = require('@slack/webhook');

class SlackService {
  constructor(webhookUrl) {
    this.webhook = new IncomingWebhook(webhookUrl);
  }

  async sendLowBalanceAlert(nftData) {
    const message = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "⚠️ Low NFT Balance Alert <!channel>",
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*NFT Label:*\n${nftData.label}`
            },
            {
              type: "mrkdwn",
              text: `*Current Balance:*\n${nftData.balance}`
            }
          ]
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Contract:*\n\`${nftData.contractAddress}\``
            },
            {
              type: "mrkdwn",
              text: `*Token ID:*\n${nftData.tokenId}`
            }
          ]
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Wallet:*\n\`${nftData.walletAddress}\``
            },
            {
              type: "mrkdwn",
              text: `*Last Checked:*\n${new Date().toLocaleString()}`
            }
          ]
        }
      ]
    };

    try {
      await this.webhook.send(message);
      console.log(`Slack notification sent for ${nftData.label}`);
    } catch (error) {
      console.error('Error sending Slack notification:', error);
    }
  }
}

module.exports = SlackService; 