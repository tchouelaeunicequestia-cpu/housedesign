import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EngineerProfile } from './engineer-profile.entity';

@Injectable()
export class EngineerProfileService {
  constructor(
    @InjectRepository(EngineerProfile)
    private readonly profileRepository: Repository<EngineerProfile>,
  ) {}

  async getProfile(): Promise<EngineerProfile> {
    let profile = await this.profileRepository.findOne({ where: {} });
    if (!profile) {
      profile = this.profileRepository.create({
        name: 'Lead Engineer',
        title: 'Principal Structural Engineer',
        bio: 'At House Design, we believe every structure should harmonize strength, safety, and modern aesthetic elegance.',
        history: 'Specializing in structural calculations, building code compliance, and precision execution.',
        experienceYears: 10,
        completedProjectsCount: 50,
      });
      await this.profileRepository.save(profile);
    }
    return profile;
  }

  async updateProfile(updateData: Partial<EngineerProfile>): Promise<EngineerProfile> {
    let profile = await this.profileRepository.findOne({ where: {} });
    if (!profile) {
      profile = this.profileRepository.create(updateData);
    } else {
      this.profileRepository.merge(profile, updateData);
    }
    return this.profileRepository.save(profile);
  }
}