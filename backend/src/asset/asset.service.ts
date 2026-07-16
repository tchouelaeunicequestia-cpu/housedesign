import { Repository } from 'typeorm';

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateAssetDto } from './dto/asset.dto';
import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = this.assetRepository.create(createAssetDto);

    if (createAssetDto.projectId) {
      asset.project = { id: createAssetDto.projectId } as any;
    }

    return this.assetRepository.save(asset);
  }

  async findAll(): Promise<Asset[]> {
    return this.assetRepository.find({ relations: { project: true } });
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.assetRepository.findOne({ where: { id }, relations: { project: true } });

    if (!asset) {
      throw new NotFoundException(`Asset with ID "${id}" not found`);
    }

    return asset;
  }

  async remove(id: string): Promise<void> {
    const result = await this.assetRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Asset with ID "${id}" not found`);
    }
  }
}
