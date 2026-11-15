import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AssetService } from './asset.service';
import { CreateAssetDto, CreateOfferDto, UpdateAssetDto, UpdateOfferStatusDto } from './dto/asset.dto';

@ApiTags('asset')
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new marketplace asset (Admin Only)' })
  @ApiResponse({ status: 201, description: 'Asset created successfully.' })
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetService.create(createAssetDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all marketplace assets (Public)' })
  findAll() {
    return this.assetService.findAll();
  }

  @Get('offers/all')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all offers submitted across all assets (Admin Only)' })
  findAllOffers() {
    return this.assetService.findAllOffers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single asset by ID (Public)' })
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an asset (Admin Only)' })
  update(
    @Param('id') id: string,
    @Body() updateAssetDto: UpdateAssetDto,
  ) {
    return this.assetService.update(id, updateAssetDto);
  }

  @Post(':id/offer')
  @ApiOperation({ summary: 'Submit an in-app negotiation offer on an asset (Public)' })
  async submitOffer(
    @Param('id') id: string,
    @Body() body: CreateOfferDto,
  ) {
    return this.assetService.handleOffer(id, body);
  }

  @Get(':id/offers')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all offers for a specific asset (Admin Only)' })
  findOffersByAsset(@Param('id') id: string) {
    return this.assetService.findOffersByAsset(id);
  }

  @Patch('offer/:offerId/status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept or reject an offer (Admin Only)' })
  updateOfferStatus(
    @Param('offerId') offerId: string,
    @Body() dto: UpdateOfferStatusDto,
  ) {
    return this.assetService.updateOfferStatus(offerId, dto.status);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an asset (Admin Only)' })
  remove(@Param('id') id: string) {
    return this.assetService.remove(id);
  }
}