import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ProjectDto {
  @ApiPropertyOptional({ description: 'The title of the project', example: 'Modern Villa Yaoundé' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'The name of the project', example: 'Modern Villa Yaoundé' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Detailed description of the project', example: 'A 3-bedroom luxury villa.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Category', example: 'Residential' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Status', example: 'Planning' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Project image URL', example: '/uploads/villa.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}