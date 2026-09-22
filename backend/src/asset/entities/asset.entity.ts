import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Project } from '../../project/project.entity';
import { Offer } from './offer.entity';

export enum AssetCategory {
  DESIGN = 'design',
  LAND = 'land',
  MATERIAL = 'material',
  OBJECT = 'object',
  TOOL = 'tool',
}

export enum AssetStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  SOLD = 'sold',
}

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  titleEn?: string;

  @Column({ nullable: true })
  titleFr?: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text', nullable: true })
  descriptionEn?: string;

  @Column({ type: 'text', nullable: true })
  descriptionFr?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price!: number;

  @Column({
    type: 'enum',
    enum: AssetCategory,
    default: AssetCategory.DESIGN,
  })
  category!: AssetCategory;

  @Column({
    type: 'enum',
    enum: AssetStatus,
    default: AssetStatus.AVAILABLE,
  })
  status!: AssetStatus;

  @Column('simple-array', { nullable: true })
  mediaUrls?: string[];

  @Column('simple-array', { nullable: true })
  documentUrls?: string[];

  @ManyToOne(() => Project, (project) => project.assets, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  project?: Project;

  @OneToMany(() => Offer, (offer) => offer.asset)
  offers!: Offer[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
