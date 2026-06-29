import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { RecipeEntity } from '../entities/recipe_entity';
import { RecipeRepository } from '../../../domain/nutrition/repositories/recipe_repository';
import { Recipe, RecipeSource } from '../../../domain/nutrition/entities/recipe';

export class RecipeRepositoryImpl implements RecipeRepository {
  private get repo(): Repository<RecipeEntity> {
    return AppDataSource.getRepository(RecipeEntity);
  }

  private toDomain(entity: RecipeEntity): Recipe {
    const recipe = new Recipe();
    recipe.id = entity.id;
    recipe.name = entity.name;
    recipe.description = entity.description;
    recipe.preparationMethod = entity.preparationMethod;
    recipe.observations = entity.observations;
    recipe.nutritionInfo = entity.nutritionInfo;
    recipe.ingredients = entity.ingredients;
    recipe.createdByNutritionistId = entity.createdByNutritionistId;
    recipe.externalId = entity.externalId;
    recipe.source = entity.source as RecipeSource;
    recipe.createdAt = entity.createdAt;
    recipe.updatedAt = entity.updatedAt;
    recipe.deletedAt = entity.deletedAt;
    return recipe;
  }

  private toEntity(domain: Recipe): RecipeEntity {
    const entity = new RecipeEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.preparationMethod = domain.preparationMethod;
    entity.observations = domain.observations;
    entity.nutritionInfo = domain.nutritionInfo;
    entity.ingredients = domain.ingredients;
    entity.createdByNutritionistId = domain.createdByNutritionistId;
    entity.externalId = domain.externalId;
    entity.source = domain.source;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;
    return entity;
  }

  async findById(id: string): Promise<Recipe | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByNutritionist(nutritionistId: string): Promise<Recipe[]> {
    const entities = await this.repo.find({
      where: { createdByNutritionistId: nutritionistId, source: 'internal' },
    });
    return entities.map(this.toDomain);
  }

  async save(recipe: Recipe): Promise<Recipe> {
    const entity = this.toEntity(recipe);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }
}