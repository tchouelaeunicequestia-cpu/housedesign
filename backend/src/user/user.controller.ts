import { Controller, Post, Body, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register the first administrator account (closed once an account exists)' })
  @ApiResponse({ status: 201, description: 'Account successfully initialized.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 409, description: 'Credentials conflict.' })
  @ApiResponse({ status: 403, description: 'Registration is closed.' })
  async register(@Body() registerUserDto: RegisterUserDto) {
    if (!(await this.userService.isRegistrationOpen())) {
      throw new ForbiddenException('Registration is closed.');
    }
    return this.userService.register(registerUserDto);
  }
}