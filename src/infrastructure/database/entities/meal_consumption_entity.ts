import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'meal_consumptions' })
@Unique(['patientId', 'mealId', 'consumptionDate'])
export class MealConsumptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'patient_id' })
  patientId!: string;

  @Column({ type: 'uuid', name: 'meal_id' })
  mealId!: string;

  @Column({ type: 'date', name: 'consumption_date' })
  consumptionDate!: Date;

  @Column({ type: 'boolean', default: false })
  consumed!: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'substituted_recipe_id' })
  substitutedRecipeId?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}