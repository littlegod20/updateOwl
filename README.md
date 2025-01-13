# UpdateOwl Slack Bot

UpdateOwl is a Slack bot designed to help teams stay updated with important notifications and reminders. This bot can be customized to send messages at scheduled times, ensuring that everyone is on the same page.

## Features

- **Scheduled Messages**: Send messages at specific times.
- **Custom Reminders**: Set up custom reminders for team members.
- **Integration with Slack**: Seamlessly integrates with your Slack workspace.
- **User-friendly Commands**: Easy-to-use commands for setting up and managing notifications.

## Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/yourusername/updateOwl.git
  ```
2. Navigate to the project directory:
  ```bash
  cd updateOwl
  ```
3. Install the dependencies:
  ```bash
  npm install
  ```

## Configuration

1. Create a `.env` file in the root directory and add your Slack bot token:
  ```
  SLACK_BOT_TOKEN=your-slack-bot-token
  ```
2. Customize the bot settings in `config.js` as needed.

## Usage

1. Start the bot:
  ```bash
  npm start
  ```
2. Invite the bot to your Slack channel.
3. Use the following commands to interact with the bot:
  - `/updateowl schedule [time] [message]` - Schedule a message.
  - `/updateowl remind [time] [message]` - Set a reminder.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or suggestions, please open an issue or contact us at support@updateowl.com.
