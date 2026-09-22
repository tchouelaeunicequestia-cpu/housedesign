import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('engineer_profile')
export class EngineerProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  titleEn?: string;

  @Column({ nullable: true })
  titleFr?: string;

  @Column('text')
  bio!: string;

  @Column('text', { nullable: true })
  bioEn?: string;

  @Column('text', { nullable: true })
  bioFr?: string;

  @Column('text')
  history!: string;

  @Column('text', { nullable: true })
  historyEn?: string;

  @Column('text', { nullable: true })
  historyFr?: string;

  @Column()
  experienceYears!: number;

  @Column()
  completedProjectsCount!: number;

  @Column({ nullable: true })
  photoUrl?: string;

  @UpdateDateColumn()
  updatedAt!: Date;
}