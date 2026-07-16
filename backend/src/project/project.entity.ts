// src/project/project.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Asset } from '../asset/entities/asset.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Asset, (asset) => asset.project)
  assets: Asset[];

  @CreateDateColumn()
  createdAt: Date;
}