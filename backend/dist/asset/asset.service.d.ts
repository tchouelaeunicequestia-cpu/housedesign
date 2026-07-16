import { Repository } from 'typeorm';
import { CreateAssetDto } from './dto/asset.dto';
import { Asset } from './entities/asset.entity';
export declare class AssetService {
    private readonly assetRepository;
    constructor(assetRepository: Repository<Asset>);
    create(createAssetDto: CreateAssetDto): Promise<Asset>;
    findAll(): Promise<Asset[]>;
    findOne(id: string): Promise<Asset>;
    remove(id: string): Promise<void>;
}
