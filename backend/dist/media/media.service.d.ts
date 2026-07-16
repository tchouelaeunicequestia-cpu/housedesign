export declare class MediaService {
    handleSingleUpload(file: Express.Multer.File, host: string, protocol: string): {
        url: string;
        originalName: string;
        size: number;
    };
    handleMultipleUploads(files: Express.Multer.File[], host: string, protocol: string): {
        url: string;
        originalName: string;
        size: number;
    }[];
}
