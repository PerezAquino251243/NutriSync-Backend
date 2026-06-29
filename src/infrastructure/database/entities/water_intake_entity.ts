import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'water_intakes' })
@Unique(['patientId', 'intakeDate'])
export class WaterIntakeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'patient_id' })
  patientId!: string;

  @Column({ type: 'date', name: 'intake_date' })
  intakeDate!: Date;

  @Column({ type: 'integer' })
  glasses!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}