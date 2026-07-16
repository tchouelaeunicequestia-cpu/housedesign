import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(credentials: any) {
    const user = await this.userService.findByUsername(credentials.username);
    if (!user) {
      throw new UnauthorizedException('Invalid system user credentials');
    }

    const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid system user credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}