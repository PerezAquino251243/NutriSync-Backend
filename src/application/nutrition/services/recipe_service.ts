import { Recipe } from '../../../domain/nutrition/entities/recipe';
import { RecipeRepository } from '../../../domain/nutrition/repositories/recipe_repository';
import { RecipeRepositoryImpl } from '../../../infrastructure/database/repositories/recipe_repository_impl';
import { CreateRecipeDto } from '../dtos/create_recipe_dto';
import { AppError } from '../../../domain/shared/exceptions/app_error';

export class RecipeService {
  private get recipeRepo(): RecipeRepository {
    return new RecipeRepositoryImpl();
  }

  async create(
    nutritionistId: string,
    data: CreateRecipeDto
  ): Promise<Recipe> {
    const recipe = new Recipe();
    recipe.name = data.name;
    recipe.description = data.description;
    recipe.preparationMethod = data.preparationMethod;
    recipe.observations = data.observations;
    recipe.nutritionInfo = data.nutritionInfo;
    recipe.ingredients = data.ingredients;
    recipe.createdByNutritionistId = nutritionistId;
    recipe.source = 'internal';

    return this.recipeRepo.save(recipe);
  }

  async listByNutritionist(nutritionistId: string): Promise<Recipe[]> {
    return this.recipeRepo.findByNutritionist(nutritionistId);
  }

  async getById(id: string): Promise<Recipe> {
    const recipe = await this.recipeRepo.findById(id);
    if (!recipe) {
      throw new AppError('Receta no encontrada', 404, 'RECIPE_NOT_FOUND');
    }
    return recipe;
  }
}