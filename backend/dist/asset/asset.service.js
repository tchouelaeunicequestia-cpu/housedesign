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
exports.AssetService = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const asset_entity_1 = require("./entities/asset.entity");
let AssetService = class AssetService {
    assetRepository;
    constructor(assetRepository) {
        this.assetRepository = assetRepository;
    }
    async create(createAssetDto) {
        const asset = this.assetRepository.create(createAssetDto);
        if (createAssetDto.projectId) {
            asset.project = { id: createAssetDto.projectId };
        }
        return this.assetRepository.save(asset);
    }
    async findAll() {
        return this.assetRepository.find({ relations: { project: true } });
    }
    async findOne(id) {
        const asset = await this.assetRepository.findOne({ where: { id }, relations: { project: true } });
        if (!asset) {
            throw new common_1.NotFoundException(`Asset with ID "${id}" not found`);
        }
        return asset;
    }
    async remove(id) {
        const result = await this.assetRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Asset with ID "${id}" not found`);
        }
    }
};
exports.AssetService = AssetService;
exports.AssetService = AssetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(asset_entity_1.Asset)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], AssetService);
//# sourceMappingURL=asset.service.js.map