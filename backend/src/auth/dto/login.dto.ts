import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiPropertyOptional({ example: 'engineer@housedesign.com', description: 'User email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'engineer_username', description: 'User username' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}