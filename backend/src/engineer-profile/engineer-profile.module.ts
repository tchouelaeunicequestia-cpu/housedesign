import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineerProfile } from './engineer-profile.entity';
import { EngineerProfileService } from './engineer-profile.service';
import { EngineerProfileController } from './engineer-profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EngineerProfile])],
  controllers: [EngineerProfileController],
  providers: [EngineerProfileService],
  exports: [EngineerProfileService],
})
export class EngineerProfileModule {}