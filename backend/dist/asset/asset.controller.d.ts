import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/asset.dto';
export declare class AssetController {
    private readonly assetService;
    constructor(assetService: AssetService);
    create(createAssetDto: CreateAssetDto): Promise<import("./entities/asset.entity").Asset>;
    findAll(): Promise<import("./entities/asset.entity").Asset[]>;
    findOne(id: string): Promise<import("./entities/asset.entity").Asset>;
    remove(id: string): Promise<void>;
}
