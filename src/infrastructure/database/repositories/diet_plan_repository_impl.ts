import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { DietPlanEntity } from '../entities/diet_plan_entity';
import { DietPlanRepository } from '../../../domain/nutrition/repositories/diet_plan_repository';
import { DietPlan } from '../../../domain/nutrition/entities/diet_plan';

export class DietPlanRepositoryImpl implements DietPlanRepository {
  private get repo(): Repository<DietPlanEntity> {
    return AppDataSource.getRepository(DietPlanEntity);
  }

  private toDomain(entity: DietPlanEntity): DietPlan {
    const plan = new DietPlan();
    plan.id = entity.id;
    plan.name = entity.name;
    plan.targetCalories = entity.targetCalories;
    plan.nutritionistId = entity.nutritionistId;
    plan.isActive = entity.isActive;
    plan.createdAt = entity.createdAt;
    plan.updatedAt = entity.updatedAt;
    plan.deletedAt = entity.deletedAt;
    return plan;
  }

  private toEntity(domain: DietPlan): DietPlanEntity {
    const entity = new DietPlanEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.targetCalories = domain.targetCalories;
    entity.nutritionistId = domain.nutritionistId;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;
    return entity;
  }

  async findById(id: string): Promise<DietPlan | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByNutritionist(nutritionistId: string): Promise<DietPlan[]> {
    const entities = await this.repo.find({
      where: { nutritionistId },
    });
    return entities.map(this.toDomain);
  }

  async save(plan: DietPlan): Promise<DietPlan> {
    const entity = this.toEntity(plan);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.update(id, { deletedAt: new Date() } as Partial<DietPlanEntity>);
  }
}