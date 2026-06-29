import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'meal_recipes' })
export class MealRecipeEntity {
  @PrimaryColumn({ type: 'uuid', name: 'meal_id' })
  mealId!: string;

  @PrimaryColumn({ type: 'uuid', name: 'recipe_id' })
  recipeId!: string;

  @Column({ type: 'integer', name: 'order_index' })
  orderIndex!: number;
}