import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { EngineerProfileService } from './engineer-profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('engineer-profile')
export class EngineerProfileController {
  constructor(private readonly profileService: EngineerProfileService) {}

  @Get()
  async getProfile() {
    return this.profileService.getProfile();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(@Body() body: any) {
    return this.profileService.updateProfile(body);
  }
}