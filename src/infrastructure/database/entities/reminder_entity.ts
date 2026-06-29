import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'reminders' })
export class ReminderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'medication_id' })
  medicationId!: string;

  @Column({ type: 'integer', nullable: true, name: 'interval_hours' })
  intervalHours?: number;

  @Column({ type: 'jsonb', name: 'days_of_week' })
  daysOfWeek!: number[];

  @Column({ type: 'varchar', length: 5, name: 'start_time' })
  startTime!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}