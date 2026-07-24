import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/asset.dto';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetService.create(createAssetDto);
  }

  @Get()
  findAll() {
    return this.assetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }

  @Post(':id/offer')
  async submitOffer(
    @Param('id') id: string,
    @Body() body: { offerAmount: number; message: string },
  ) {
    return this.assetService.handleOffer(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetService.remove(id);
  }
}