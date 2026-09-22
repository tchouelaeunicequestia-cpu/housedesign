import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Asset } from './asset.entity';

export enum OfferStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  offerAmount!: number;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column()
  senderName!: string;

  @Column()
  senderEmail!: string;

  @Column({ nullable: true })
  senderPhone?: string;

  @Column({
    type: 'enum',
    enum: OfferStatus,
    default: OfferStatus.PENDING,
  })
  status!: OfferStatus;

  @ManyToOne(() => Asset, (asset) => asset.offers, {
    onDelete: 'CASCADE',
  })
  asset!: Asset;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
