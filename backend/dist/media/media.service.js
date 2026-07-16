"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
let MediaService = class MediaService {
    handleSingleUpload(file, host, protocol) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded or file type is invalid.');
        }
        const cleanHost = host.replace(/\/$/, '');
        const fileUrl = `${protocol}://${cleanHost}/uploads/${file.filename}`;
        return {
            url: fileUrl,
            originalName: file.originalname,
            size: file.size,
        };
    }
    handleMultipleUploads(files, host, protocol) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded.');
        }
        return files.map((file) => this.handleSingleUpload(file, host, protocol));
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)()
], MediaService);
//# sourceMappingURL=media.service.js.map