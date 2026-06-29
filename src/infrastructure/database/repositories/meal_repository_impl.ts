import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { MealEntity } from '../entities/meal_entity';
import { MealRepository } from '../../../domain/nutrition/repositories/meal_repository';
import { Meal, MealType } from '../../../domain/nutrition/entities/meal';

export class MealRepositoryImpl implements MealRepository {
  private get repo(): Repository<MealEntity> {
    return AppDataSource.getRepository(MealEntity);
  }

  private toDomain(entity: MealEntity): Meal {
    const meal = new Meal();
    meal.id = entity.id;
    meal.dietPlanId = entity.dietPlanId;
    meal.dayNumber = entity.dayNumber;
    meal.mealType = entity.mealType as MealType;
    meal.scheduledTime = entity.scheduledTime;
    meal.createdAt = entity.createdAt;
    meal.updatedAt = entity.updatedAt;
    return meal;
  }

  private toEntity(domain: Meal): MealEntity {
    const entity = new MealEntity();
    entity.id = domain.id;
    entity.dietPlanId = domain.dietPlanId;
    entity.dayNumber = domain.dayNumber;
    entity.mealType = domain.mealType;
    entity.scheduledTime = domain.scheduledTime;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  async findById(id: string): Promise<Meal | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByDietPlan(dietPlanId: string): Promise<Meal[]> {
    const entities = await this.repo.find({ where: { dietPlanId } });
    return entities.map(this.toDomain);
  }

  async save(meal: Meal): Promise<Meal> {
    const entity = this.toEntity(meal);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}