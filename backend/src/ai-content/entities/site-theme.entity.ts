import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ThemeStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  REJECTED = 'rejected',
}

/**
 * A seasonal look for the website. It only stores a few allowed values (never CSS or code):
 * the frontend turns them into colours itself.
 */
@Entity('site_themes')
export class SiteTheme {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ default: 'custom' })
  season!: string;

  @Column()
  tint!: string;

  @Column({ type: 'float' })
  tintOpacity!: number;

  @Column()
  accent!: string;

  @Column({ default: '' })
  banner!: string;

  @Column({ type: 'enum', enum: ThemeStatus, default: ThemeStatus.DRAFT })
  status!: ThemeStatus;

  @Column({ default: true })
  aiGenerated!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  activatedAt?: Date | null;
}
