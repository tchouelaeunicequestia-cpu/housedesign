import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EngineerProfileService } from './engineer-profile.service';

@ApiTags('engineer-profile')
@Controller('engineer-profile')
export class EngineerProfileController {
  constructor(private readonly profileService: EngineerProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get engineer profile (Public)' })
  async getProfile() {
    return this.profileService.getProfile();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put()
  @ApiOperation({ summary: 'Update engineer profile (Admin Only)' })
  async updateProfile(@Body() body: any) {
    return this.profileService.updateProfile(body);
  }
}
