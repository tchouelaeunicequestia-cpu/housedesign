import { Module } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { AiContentModule } from '../ai-content/ai-content.module';

@Module({
  imports: [AiContentModule],
  providers: [AiAgentService],
})
export class AiAgentModule {}
