import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ProjectDto {
  @ApiProperty({ 
    description: 'The name of the architectural project',
    example: 'Modern Villa Yaoundé' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Detailed description of the structural design',
    example: 'A 3-bedroom luxury villa with sustainable materials.' 
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}