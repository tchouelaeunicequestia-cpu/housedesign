import { AssetCategory, AssetStatus } from '../entities/asset.entity';
export declare class CreateAssetDto {
    title: string;
    description: string;
    price: number;
    category: AssetCategory;
    status?: AssetStatus;
    mediaUrls?: string[];
    documentUrls?: string[];
    projectId?: string;
}
