"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTypeOrmOptions = buildTypeOrmOptions;
function buildTypeOrmOptions(configService) {
    const databaseUrl = configService.get('DATABASE_URL');
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not set. Create a .env file with your Neon connection string.');
    }
    return {
        type: 'postgres',
        url: databaseUrl,
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
            rejectUnauthorized: false,
        },
    };
}
//# sourceMappingURL=typeorm.config.js.map