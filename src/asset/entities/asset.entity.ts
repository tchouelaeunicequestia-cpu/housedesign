import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Project } from '../../project/project.entity';

export enum AssetCategory {
  LAND = 'land',
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

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price!: number;

  @Column({
    type: 'enum',
    enum: AssetCategory,
    default: AssetCategory.OBJECT,
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
  project!: Project;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
