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

  async login(credentials: { email?: string; username?: string; password: string }) {
    const identifier = credentials.email || credentials.username;
    if (!identifier) {
      throw new UnauthorizedException('Email or username is required');
    }

    const user = await this.userService.findByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedException('Invalid system user credentials');
    }

    const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid system user credentials');
    }

    const payload = { username: user.username, sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}