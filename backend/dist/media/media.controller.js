"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const media_service_1 = require("./media.service");
const fileFilter = (req, file, callback) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx', '.mp4', '.mov'];
    const ext = (0, path_1.extname)(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        return callback(new common_1.BadRequestException(`Unsupported file type. Allowed: ${allowedExtensions.join(', ')}`), false);
    }
    callback(null, true);
};
const storageConfig = (0, multer_1.diskStorage)({
    destination: './uploads',
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = (0, path_1.extname)(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});
let MediaController = class MediaController {
    mediaService;
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    uploadSingle(file, req) {
        const host = req.get('host') || 'localhost:3000';
        const protocol = req.protocol;
        return this.mediaService.handleSingleUpload(file, host, protocol);
    }
    uploadMultiple(files, req) {
        const host = req.get('host') || 'localhost:3000';
        const protocol = req.protocol;
        return this.mediaService.handleMultipleUploads(files, host, protocol);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Post)('upload-single'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a single media file or blueprint document' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'File uploaded successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request or unsupported file format.' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: storageConfig,
        fileFilter: fileFilter,
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "uploadSingle", null);
__decorate([
    (0, common_1.Post)('upload-multiple'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple assets or project images' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Files uploaded successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request or unsupported formats.' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: storageConfig,
        fileFilter: fileFilter,
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "uploadMultiple", null);
exports.MediaController = MediaController = __decorate([
    (0, swagger_1.ApiTags)('media'),
    (0, common_1.Controller)('media'),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map