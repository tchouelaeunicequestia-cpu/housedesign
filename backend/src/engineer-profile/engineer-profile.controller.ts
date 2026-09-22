import { Controller, Get, Put, Body, UseGuards, Query, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EngineerProfileService } from './engineer-profile.service';

@ApiTags('engineer-profile')
@Controller('engineer-profile')
export class EngineerProfileController {
  constructor(private readonly profileService: EngineerProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get engineer profile (Public)' })
  @ApiQuery({ name: 'locale', required: false, description: 'Locale code (en or fr)' })
  async getProfile(
    @Query('locale') queryLocale?: string,
    @Headers('accept-language') headerLocale?: string,
  ) {
    const locale = queryLocale || headerLocale;
    return this.profileService.getProfile(locale);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put()
  @ApiOperation({ summary: 'Update engineer profile with auto-translation (Admin Only)' })
  async updateProfile(@Body() body: any) {
    return this.profileService.updateProfile(body);
  }
}