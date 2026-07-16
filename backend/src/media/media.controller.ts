import type {
  Request,
} from 'express'; // 👈 Fixed: Using 'import type' to satisfy TS1272
import { diskStorage } from 'multer';
import { extname } from 'path';

// src/media/media.controller.ts
import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MediaService } from './media.service';

// Custom file filter to block dangerous or unapproved extensions
const fileFilter = (req: any, file: any, callback: any) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx', '.mp4', '.mov'];
  const ext = extname(file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(ext)) {
    return callback(new BadRequestException(`Unsupported file type. Allowed: ${allowedExtensions.join(', ')}`), false);
  }
  callback(null, true);
};

// Storage configuration with unique filename generation
const storageConfig = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-single')
  @ApiOperation({ summary: 'Upload a single media file or blueprint document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request or unsupported file format.' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig,
      fileFilter: fileFilter,
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB maximum size (supports video/specs)
    }),
  )
  uploadSingle(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol;
    return this.mediaService.handleSingleUpload(file, host, protocol);
  }

  @Post('upload-multiple')
  @ApiOperation({ summary: 'Upload multiple assets or project images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request or unsupported formats.' })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: storageConfig,
      fileFilter: fileFilter,
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[], @Req() req: Request) {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol;
    return this.mediaService.handleMultipleUploads(files, host, protocol);
  }
}