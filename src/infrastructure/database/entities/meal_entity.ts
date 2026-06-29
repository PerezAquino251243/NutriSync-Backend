import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'meals' })
export class MealEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'diet_plan_id' })
  dietPlanId!: string;

  @Column({ type: 'integer', name: 'day_number' })
  dayNumber!: number;

  @Column({ type: 'varchar', length: 20, name: 'meal_type' })
  mealType!: string;

  @Column({ type: 'varchar', length: 5, name: 'scheduled_time' })
  scheduledTime!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}