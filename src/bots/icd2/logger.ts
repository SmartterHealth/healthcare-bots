import * as chalk from 'chalk';
import settings from './settings';

/**
 * The prefix for messages logged to console. Pulls value from ENV and decorates 
 * with colored brackets. Useful for distinguishing custom logs from the bot framework output.
 */
const prefix = chalk.default.white('[') + chalk.default.gray(settings.bot.displayName) + chalk.default.white(']');

/**
 * Simple message logging function.
 * @param message The message to log.
 */
export default function log(message: string | object) {
    if (typeof message === 'object') { message = JSON.stringify(message); }
    console.log(`${prefix} ${message}`);
}
