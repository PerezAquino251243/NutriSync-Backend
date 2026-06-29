import { Meal } from '../../../domain/nutrition/entities/meal';
import { MealRecipe } from '../../../domain/nutrition/entities/meal_recipe';
import { MealRepository } from '../../../domain/nutrition/repositories/meal_repository';
import { MealRepositoryImpl } from '../../../infrastructure/database/repositories/meal_repository_impl';
import { MealRecipeRepository } from '../../../domain/nutrition/repositories/meal_recipe_repository';
import { MealRecipeRepositoryImpl } from '../../../infrastructure/database/repositories/meal_recipe_repository_impl';
import { CreateMealDto } from '../dtos/create_meal_dto';

export class MealService {
  private get mealRepo(): MealRepository {
    return new MealRepositoryImpl();
  }

  private get mealRecipeRepo(): MealRecipeRepository {
    return new MealRecipeRepositoryImpl();
  }

  async createMealsForPlan(
    dietPlanId: string,
    meals: CreateMealDto[]
  ): Promise<Meal[]> {
    const result: Meal[] = [];

    for (const mealData of meals) {
      const meal = new Meal();
      meal.dietPlanId = dietPlanId;
      meal.dayNumber = mealData.dayNumber;
      meal.mealType = mealData.mealType;
      meal.scheduledTime = mealData.scheduledTime;

      const savedMeal = await this.mealRepo.save(meal);

      for (let i = 0; i < mealData.recipeIds.length; i++) {
        const mealRecipe = new MealRecipe();
        mealRecipe.mealId = savedMeal.id;
        mealRecipe.recipeId = mealData.recipeIds[i];
        mealRecipe.orderIndex = i;
        await this.mealRecipeRepo.save(mealRecipe);
      }

      result.push(savedMeal);
    }

    return result;
  }
}