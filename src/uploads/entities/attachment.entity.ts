import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Upload } from './upload.entity';

export enum AttachmentTypeEnum {
  ID = 'ID',
  CERTIFICATE = 'CERTIFICATE',
  LICENSE = 'LICENSE',
  PROFILE_PICTURE = 'PROFILE_PICTURE',
}

@Entity('attachments')
export class Attachments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  user_id: string;

  @OneToOne(() => Upload, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'upload_id', referencedColumnName: 'id' }) //referencedColumnName : name  of the column in the Site entity , name : name of the column in the Guard entity
  upload: Upload;

  @Column({ type: 'enum', enum: AttachmentTypeEnum, nullable: false })
  type: AttachmentTypeEnum;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  deletedAt?: Date;
}
