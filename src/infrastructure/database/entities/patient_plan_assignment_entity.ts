import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'patient_plan_assignments' })
export class PatientPlanAssignmentEntity {
  @PrimaryColumn({ type: 'uuid', name: 'diet_plan_id' })
  dietPlanId!: string;

  @PrimaryColumn({ type: 'uuid', name: 'patient_id' })
  patientId!: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt!: Date;
}