import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EngineerProfileService } from './engineer-profile.service';

@Controller('engineer-profile')
export class EngineerProfileController {
  constructor(private readonly profileService: EngineerProfileService) {}

  @Get()
  async getProfile() {
    return this.profileService.getProfile();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateProfile(@Body() body: any) {
    return this.profileService.updateProfile(body);
  }
}