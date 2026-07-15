import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class MediaService {
  /**
   * Generates a web-accessible URL for an uploaded file
   * @param file The uploaded file object from Multer
   * @param host The host domain (e.g., localhost:3000 or your Railway domain)
   * @param protocol The protocol (http or https)
   */
  handleSingleUpload(file: Express.Multer.File, host: string, protocol: string): { url: string; originalName: string; size: number } {
    if (!file) {
      throw new BadRequestException('No file uploaded or file type is invalid.');
    }

    // Standardize URL formatting regardless of local or production environments
    const cleanHost = host.replace(/\/$/, '');
    const fileUrl = `${protocol}://${cleanHost}/uploads/${file.filename}`;

    return {
      url: fileUrl,
      originalName: file.originalname,
      size: file.size,
    };
  }

  /**
   * Generates web-accessible URLs for multiple uploaded files
   */
  handleMultipleUploads(files: Express.Multer.File[], host: string, protocol: string): { url: string; originalName: string; size: number }[] {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded.');
    }

    return files.map((file) => this.handleSingleUpload(file, host, protocol));
  }
}