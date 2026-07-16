"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const asset_module_1 = require("./asset/asset.module");
const auth_module_1 = require("./auth/auth.module");
const media_module_1 = require("./media/media.module");
const project_module_1 = require("./project/project.module");
const user_module_1 = require("./user/user.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const dbUrl = configService.get('DATABASE_URL');
                    return {
                        type: 'postgres',
                        url: dbUrl,
                        autoLoadEntities: true,
                        synchronize: true,
                        ssl: {
                            rejectUnauthorized: false,
                        },
                    };
                },
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            asset_module_1.AssetModule,
            project_module_1.ProjectModule,
            media_module_1.MediaModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map