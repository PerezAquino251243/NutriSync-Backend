import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { MealRecipeEntity } from '../entities/meal_recipe_entity';
import { MealRecipeRepository } from '../../../domain/nutrition/repositories/meal_recipe_repository';
import { MealRecipe } from '../../../domain/nutrition/entities/meal_recipe';

export class MealRecipeRepositoryImpl implements MealRecipeRepository {
  private get repo(): Repository<MealRecipeEntity> {
    return AppDataSource.getRepository(MealRecipeEntity);
  }

  private toDomain(entity: MealRecipeEntity): MealRecipe {
    const mr = new MealRecipe();
    mr.mealId = entity.mealId;
    mr.recipeId = entity.recipeId;
    mr.orderIndex = entity.orderIndex;
    return mr;
  }

  private toEntity(domain: MealRecipe): MealRecipeEntity {
    const entity = new MealRecipeEntity();
    entity.mealId = domain.mealId;
    entity.recipeId = domain.recipeId;
    entity.orderIndex = domain.orderIndex;
    return entity;
  }

  async findByMeal(mealId: string): Promise<MealRecipe[]> {
    const entities = await this.repo.find({ where: { mealId } });
    return entities.map(this.toDomain);
  }

  async save(mealRecipe: MealRecipe): Promise<MealRecipe> {
    const entity = this.toEntity(mealRecipe);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async deleteByMeal(mealId: string): Promise<void> {
    await this.repo.delete({ mealId } as Partial<MealRecipeEntity>);
  }
}