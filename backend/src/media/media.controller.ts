import type {
  Request,
} from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MediaService } from './media.service';

const fileFilter = (req: any, file: any, callback: any) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx', '.mp4', '.mov'];
  const ext = extname(file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(ext)) {
    return callback(new BadRequestException(`Unsupported file type. Allowed: ${allowedExtensions.join(', ')}`), false);
  }
  callback(null, true);
};

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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a single media file or blueprint document (Admin Only)' })
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig,
      fileFilter: fileFilter,
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  uploadSingle(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol;
    return this.mediaService.handleSingleUpload(file, host, protocol);
  }

  @Post('upload-multiple')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload multiple assets or project images (Admin Only)' })
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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