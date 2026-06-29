import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'medication_taken' })
export class MedicationTakenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'reminder_id' })
  reminderId!: string;

  @Column({ type: 'timestamp', name: 'scheduled_datetime' })
  scheduledDatetime!: Date;

  @Column({ type: 'boolean', default: false })
  taken!: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'taken_at' })
  takenAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}