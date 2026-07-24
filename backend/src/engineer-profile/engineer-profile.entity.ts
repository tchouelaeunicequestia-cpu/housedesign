import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('engineer_profile')
export class EngineerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column('text')
  bio: string;

  @Column('text')
  history: string;

  @Column()
  experienceYears: number;

  @Column()
  completedProjectsCount: number;

  @Column({ nullable: true })
  photoUrl: string;

  @UpdateDateColumn()
  updatedAt: Date;
}