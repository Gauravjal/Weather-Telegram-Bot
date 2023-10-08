import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
const TelegramBot = require('node-telegram-bot-api');

const TELEGRAM_TOKEN = '6259689747:AAEMQBAoXZIEIfrzzJIihNlUoKDNAbsdgzE';
const OPENWEATHERMAP_API_KEY = 'b4bdac792cf4f921d41e022ff46d29f7';

@Injectable()
export class TelegramService {
  private logger = new Logger(TelegramService.name);
  private bot: any;
  private subscribers: Set<number> = new Set(); // Set to store chatIds of subscribers

  constructor() {
    this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
    this.bot.on('message', this.handleMessages.bind(this));

    setInterval(() => {
      this.sendDailyWeatherUpdates();
    }, 24 * 60 * 60 * 1000); // Every 24 hours
  }

  async handleMessages(msg: any): Promise<void> {
    const chatId = msg.chat.id;
    const message = msg.text;

    if (message.startsWith('/weather')) {
      const city = message.split(' ')[1];
      if (city) {
        try {
          const weatherData = await this.getWeatherData(city);
          this.bot.sendMessage(chatId, weatherData);
        } catch (error) {
          this.logger.error(`Error fetching weather data: ${error.message}`);
          this.bot.sendMessage(chatId, 'Error fetching weather data. Please try again later.');
        }
      } else {
        this.bot.sendMessage(chatId, 'Please provide a city name for weather information.');
      }
    } else if (message.startsWith('/subscribe')) {
      this.subscribers.add(chatId);
      this.bot.sendMessage(chatId, 'You are now subscribed to daily weather updates.');
    } else if (message.startsWith('/unsubscribe')) {
      this.subscribers.delete(chatId);
      this.bot.sendMessage(chatId, 'You have unsubscribed from daily weather updates.');
    } else {
      const serverTime = new Date();
      const ISTOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
      const kolkataTime = new Date(serverTime.getTime() + ISTOffset);

      const serverHour = kolkataTime.getUTCHours(); // Get Kolkata's local hour
      const serverMinute = kolkataTime.getUTCMinutes(); // Get Kolkata's local minute

      // this.bot.sendMessage(chatId, `Received your message: ${message}`);
      this.bot.sendMessage(chatId,serverHour + ":" + serverMinute);
    }
  }

  async sendDailyWeatherUpdates(): Promise<void> {
    const cities = ['pune', 'latur', 'delhi']; // List of cities to send weather updates for

    const serverTime = new Date();
    const ISTOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const kolkataTime = new Date(serverTime.getTime() + ISTOffset);

    const serverHour = kolkataTime.getUTCHours(); // Get Kolkata's local hour
    const serverMinute = kolkataTime.getUTCMinutes(); // Get Kolkata's local minute

    // if (serverHour === 14 && serverMinute === 53) {
      console.log('It invoked');


        try {
          const weatherData = await this.getWeatherData('pune');
          for (const subscriber of this.subscribers) {
            this.bot.sendMessage(subscriber, `Daily Weather Update for pune: ${weatherData}`);
          }
        } catch (error) {
          this.logger.error(`Error sending daily weather update for pune: ${error.message}`);
        }
      
    // }
  }

  async getWeatherData(city: string): Promise<string> {
    // Same as your existing getWeatherData method
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;

    try {
      const response = await axios.get(apiUrl);
      const temperature = response.data.main.temp;
      const weatherDescription = response.data.weather[0].description;
      return `Weather in ${city}: ${weatherDescription}, Temperature: ${temperature}°C`;
    } catch (error) {
      throw new Error('Failed to fetch weather data.');
    }
  }
}
