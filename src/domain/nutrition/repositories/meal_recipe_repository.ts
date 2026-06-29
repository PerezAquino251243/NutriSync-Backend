import { MealRecipe } from '../entities/meal_recipe';

export interface MealRecipeRepository {
  findByMeal(mealId: string): Promise<MealRecipe[]>;
  save(mealRecipe: MealRecipe): Promise<MealRecipe>;
  deleteByMeal(mealId: string): Promise<void>;
}