import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EngineerProfile } from './engineer-profile.entity';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class EngineerProfileService {
  constructor(
    @InjectRepository(EngineerProfile)
    private readonly profileRepository: Repository<EngineerProfile>,
    private readonly translationService: TranslationService,
  ) {}

  async getProfile(locale?: string): Promise<EngineerProfile> {
    let profile = await this.profileRepository.findOne({ where: {} });
    if (!profile) {
      profile = this.profileRepository.create({
        name: 'Lead Engineer',
        title: 'Principal Structural Engineer',
        titleEn: 'Principal Structural Engineer',
        titleFr: 'Ingénieur en Chef Génie Civil & Structures',
        bio: 'At House Design, we believe every structure should harmonize strength, safety, and modern aesthetic elegance.',
        bioEn: 'At House Design, we believe every structure should harmonize strength, safety, and modern aesthetic elegance.',
        bioFr: 'Chez House Design, nous pensons que chaque bâtiment doit allier robustesse pérenne, sécurité absolue et élégance architecturale contemporaine.',
        history: 'Specializing in structural calculations, building code compliance, and precision execution.',
        historyEn: 'Specializing in structural calculations, building code compliance, and precision execution.',
        historyFr: 'Spécialisé dans les calculs de béton armé, la conformité aux normes parasismiques et le pilotage de chantiers complexes.',
        experienceYears: 10,
        completedProjectsCount: 50,
      });
      await this.profileRepository.save(profile);
    }

    if (!locale) return profile;
    return this.localizeProfile(profile, locale);
  }

  async updateProfile(updateData: Partial<EngineerProfile>): Promise<EngineerProfile> {
    let profile = await this.profileRepository.findOne({ where: {} });
    if (!profile) {
      profile = this.profileRepository.create(updateData);
    }

    // Auto-translate if text fields updated
    if (updateData.title) {
      const titlePair = await this.translationService.translatePair(updateData.title);
      updateData.titleEn = titlePair.en;
      updateData.titleFr = titlePair.fr;
    }

    if (updateData.bio) {
      const bioPair = await this.translationService.translatePair(updateData.bio);
      updateData.bioEn = bioPair.en;
      updateData.bioFr = bioPair.fr;
    }

    if (updateData.history) {
      const histPair = await this.translationService.translatePair(updateData.history);
      updateData.historyEn = histPair.en;
      updateData.historyFr = histPair.fr;
    }

    this.profileRepository.merge(profile, updateData);
    return this.profileRepository.save(profile);
  }

  private localizeProfile(profile: EngineerProfile, locale: string): EngineerProfile {
    const isFr = locale.toLowerCase().startsWith('fr');
    return {
      ...profile,
      title: isFr ? (profile.titleFr || profile.title) : (profile.titleEn || profile.title),
      bio: isFr ? (profile.bioFr || profile.bio) : (profile.bioEn || profile.bio),
      history: isFr ? (profile.historyFr || profile.history) : (profile.historyEn || profile.history),
    };
  }
}