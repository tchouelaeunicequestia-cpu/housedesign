import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiClient } from './ai-client';

/** Nest wrapper around AiClient: reads the AI settings from the environment (.env). */
@Injectable()
export class AiTextService extends AiClient {
  constructor(config: ConfigService) {
    super((key) => config.get<string>(key), new Logger('AiText'));
  }
}
