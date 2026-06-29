import { Recipe } from '../entities/recipe';

export interface RecipeRepository {
  findById(id: string): Promise<Recipe | null>;
  findByNutritionist(nutritionistId: string): Promise<Recipe[]>;
  save(recipe: Recipe): Promise<Recipe>;
}