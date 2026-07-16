import { Asset } from '../asset/entities/asset.entity';
export declare class Project {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    assets: Asset[];
    createdAt: Date;
}
