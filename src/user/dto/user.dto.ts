import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'admin_yaounde', description: 'Unique account name' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'contact@housedesign.cm', description: 'Valid admin email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'Minimum 6 character password' })
  @IsString()
  @MinLength(6)
  password: string;
}