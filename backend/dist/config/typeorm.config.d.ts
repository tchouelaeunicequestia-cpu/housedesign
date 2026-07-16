import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare function buildTypeOrmOptions(configService: ConfigService): TypeOrmModuleOptions;
