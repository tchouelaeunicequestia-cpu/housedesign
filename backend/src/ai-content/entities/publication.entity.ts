import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum PublicationKind {
  PROJECT_STORY = 'project_story',
  DESIGN_CONCEPT = 'design_concept',
  NEWS = 'news',
}

export enum PublicationStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
}

@Entity('publications')
export class Publication {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: PublicationKind })
  kind!: PublicationKind;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  body!: string;

  /** Relative path such as /uploads/ai-123.png, or a full URL. */
  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string | null;

  @Column({ type: 'enum', enum: PublicationStatus, default: PublicationStatus.DRAFT })
  status!: PublicationStatus;

  @Column({ default: true })
  aiGenerated!: boolean;

  /** The project this post was written from (project stories only). */
  @Column({ type: 'int', nullable: true })
  sourceProjectId?: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt?: Date | null;
}
