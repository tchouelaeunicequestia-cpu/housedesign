import { Module } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { UserModule } from '../user/user.module';
import { AssetModule } from '../asset/asset.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, AssetModule, ConfigModule],
  providers: [AiAgentService],
})
export class AiAgentModule {}
