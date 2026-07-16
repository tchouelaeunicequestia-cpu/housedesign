import type { Request } from 'express';
import { MediaService } from './media.service';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    uploadSingle(file: Express.Multer.File, req: Request): {
        url: string;
        originalName: string;
        size: number;
    };
    uploadMultiple(files: Express.Multer.File[], req: Request): {
        url: string;
        originalName: string;
        size: number;
    }[];
}
