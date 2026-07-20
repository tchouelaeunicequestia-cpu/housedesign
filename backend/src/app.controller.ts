import {
  Controller,
  Get,
} from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // Add this to your main app controller
  @Get()
  getHealth() {
    return { status: 'ok', message: 'Backend is reachable' };
  }
}
