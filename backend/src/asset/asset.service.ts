import { Repository } from 'typeorm';

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateAssetDto, CreateOfferDto, UpdateAssetDto } from './dto/asset.dto';
import { Asset } from './entities/asset.entity';
import { Offer, OfferStatus } from './entities/offer.entity';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly translationService: TranslationService,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const [titlePair, descPair] = await Promise.all([
      this.translationService.translatePair(createAssetDto.title),
      this.translationService.translatePair(createAssetDto.description),
    ]);

    const asset = this.assetRepository.create({
      ...createAssetDto,
      title: createAssetDto.title,
      titleEn: titlePair.en,
      titleFr: titlePair.fr,
      description: createAssetDto.description,
      descriptionEn: descPair.en,
      descriptionFr: descPair.fr,
    });

    if (createAssetDto.projectId) {
      asset.project = { id: createAssetDto.projectId } as any;
    }

    return this.assetRepository.save(asset);
  }

  async findAll(locale?: string): Promise<Asset[]> {
    const assets = await this.assetRepository.find({
      relations: { project: true, offers: true },
      order: { createdAt: 'DESC' },
    });

    if (!locale) return assets;
    return assets.map((a) => this.localizeAsset(a, locale));
  }

  async findOne(id: string, locale?: string): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id },
      relations: { project: true, offers: true },
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID "${id}" not found`);
    }

    if (!locale) return asset;
    return this.localizeAsset(asset, locale);
  }

  async update(id: string, updateAssetDto: UpdateAssetDto): Promise<Asset> {
    const asset = await this.assetRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Asset with ID "${id}" not found`);
    }

    if (updateAssetDto.title && updateAssetDto.title !== asset.title) {
      const titlePair = await this.translationService.translatePair(updateAssetDto.title);
      asset.titleEn = titlePair.en;
      asset.titleFr = titlePair.fr;
    }

    if (updateAssetDto.description && updateAssetDto.description !== asset.description) {
      const descPair = await this.translationService.translatePair(updateAssetDto.description);
      asset.descriptionEn = descPair.en;
      asset.descriptionFr = descPair.fr;
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

  private localizeAsset(asset: Asset, locale: string): Asset {
    const isFr = locale.toLowerCase().startsWith('fr');
    return {
      ...asset,
      title: isFr ? (asset.titleFr || asset.title) : (asset.titleEn || asset.title),
      description: isFr ? (asset.descriptionFr || asset.description) : (asset.descriptionEn || asset.description),
    };
  }
}