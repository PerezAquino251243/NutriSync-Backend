import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'recipes' })
export class RecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text', name: 'preparation_method' })
  preparationMethod!: string;

  @Column({ type: 'text', nullable: true })
  observations?: string;

  @Column({ type: 'jsonb', name: 'nutrition_info' })
  nutritionInfo!: Record<string, unknown>;

  @Column({ type: 'jsonb' })
  ingredients!: unknown[];

  @Column({ type: 'uuid', name: 'created_by_nutritionist_id' })
  createdByNutritionistId!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'external_id' })
  externalId?: string;

  @Column({ type: 'varchar', length: 20, default: 'internal' })
  source!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt?: Date;
}