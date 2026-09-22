import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AssetCategory, AssetStatus } from '../entities/asset.entity';
import { OfferStatus } from '../entities/offer.entity';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsEnum(AssetCategory)
  @IsNotEmpty()
  category!: AssetCategory;

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

export class UpdateAssetDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsEnum(AssetCategory)
  @IsOptional()
  category?: AssetCategory;

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

export class CreateOfferDto {
  @IsNumber()
  @IsNotEmpty()
  offerAmount!: number;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsNotEmpty()
  senderName!: string;

  @IsEmail()
  @IsNotEmpty()
  senderEmail!: string;

  @IsString()
  @IsOptional()
  senderPhone?: string;
}

export class UpdateOfferStatusDto {
  @IsEnum(OfferStatus)
  @IsNotEmpty()
  status!: OfferStatus;
}
