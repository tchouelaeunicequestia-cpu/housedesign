import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AssetCategory, AssetStatus } from '../entities/asset.entity';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsEnum(AssetCategory)
  @IsNotEmpty()
  category: AssetCategory;

  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mediaUrls?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documentUrls?: string[];

  @IsString()
  @IsOptional()
  projectId?: string;
}
