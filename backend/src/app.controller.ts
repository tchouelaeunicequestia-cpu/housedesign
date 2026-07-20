import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // Empty decorator means this handles the base path
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // Empty decorator means this handles the GET request to the base path
  getRoot() {
    return { status: 'ok', message: 'Backend is online' };
  }
}