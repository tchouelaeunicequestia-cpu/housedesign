import { Repository } from 'typeorm';

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateAssetDto, CreateOfferDto, UpdateAssetDto } from './dto/asset.dto';
import { Asset } from './entities/asset.entity';
import { Offer, OfferStatus } from './entities/offer.entity';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = this.assetRepository.create(createAssetDto);

    if (createAssetDto.projectId) {
      asset.project = { id: createAssetDto.projectId } as any;
    }

    return this.assetRepository.save(asset);
  }

  async findAll(): Promise<Asset[]> {
    return await this.assetRepository.find({
      relations: { project: true, offers: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id },
      relations: { project: true, offers: true },
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID "${id}" not found`);
    }

    return asset;
  }

  async update(id: string, updateAssetDto: UpdateAssetDto): Promise<Asset> {
    const asset = await this.assetRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Asset with ID "${id}" not found`);
    }

    Object.assign(asset, updateAssetDto);

    if (updateAssetDto.projectId) {
      asset.project = { id: updateAssetDto.projectId } as any;
    }

    return this.assetRepository.save(asset);
  }

  async handleOffer(assetId: string, offerDto: CreateOfferDto): Promise<Offer> {
    const asset = await this.findOne(assetId);

    const offer = this.offerRepository.create({
      ...offerDto,
      status: OfferStatus.PENDING,
      asset,
    });

    return this.offerRepository.save(offer);
  }

  async findAllOffers(): Promise<Offer[]> {
    return this.offerRepository.find({
      relations: { asset: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOffersByAsset(assetId: string): Promise<Offer[]> {
    return this.offerRepository.find({
      where: { asset: { id: assetId } },
      order: { createdAt: 'DESC' },
    });
  }

  async updateOfferStatus(offerId: string, status: OfferStatus): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id: offerId },
      relations: { asset: true },
    });

    if (!offer) {
      throw new NotFoundException(`Offer with ID "${offerId}" not found`);
    }

    offer.status = status;
    return this.offerRepository.save(offer);
  }

  async remove(id: string): Promise<void> {
    const result = await this.assetRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Asset with ID "${id}" not found`);
    }
  }
}