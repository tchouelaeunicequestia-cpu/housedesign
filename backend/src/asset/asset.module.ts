import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { Asset } from './entities/asset.entity';
import { Offer } from './entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, Offer])],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
