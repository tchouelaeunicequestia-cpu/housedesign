import {
  Controller,
  Get,
} from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // This handles the GET /api/ route
  @Get()
  getHello() {
    return { status: 'ok', message: 'Backend is online and working!' };
  }
}
