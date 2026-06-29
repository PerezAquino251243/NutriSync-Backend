import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'mood_logs' })
@Unique(['patientId', 'logDate'])
export class MoodLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'patient_id' })
  patientId!: string;

  @Column({ type: 'date', name: 'log_date' })
  logDate!: Date;

  @Column({ type: 'smallint', name: 'mood_type' })
  moodType!: number;

  @Column({ type: 'text', nullable: true, name: 'patient_comment' })
  patientComment?: string;

  @Column({ type: 'text', nullable: true, name: 'nutritionist_comment' })
  nutritionistComment?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}