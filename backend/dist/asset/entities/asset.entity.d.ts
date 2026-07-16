import { Project } from '../../project/project.entity';
export declare enum AssetCategory {
    LAND = "land",
    OBJECT = "object",
    TOOL = "tool"
}
export declare enum AssetStatus {
    AVAILABLE = "available",
    PENDING = "pending",
    SOLD = "sold"
}
export declare class Asset {
    id: string;
    title: string;
    description: string;
    price: number;
    category: AssetCategory;
    status: AssetStatus;
    mediaUrls?: string[];
    documentUrls?: string[];
    project: Project;
    createdAt: Date;
    updatedAt: Date;
}
