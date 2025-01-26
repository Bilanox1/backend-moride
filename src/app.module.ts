import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { Connection } from 'mongoose';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make the ConfigModule global
      envFilePath: '.env', // Specify the path to your .env file
    }),
    // Use ConfigService to get the MongoDB URI
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // Get the MongoDB URI from .env
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(@InjectConnection() private readonly connection: Connection) {
    this.connection.on('connected', () => {
      console.log('Successfully connected to MongoDB database');
    });

    this.connection.on('error', (error) => {
      console.error('Failed to connect to MongoDB database:', error);
    });
  }
}