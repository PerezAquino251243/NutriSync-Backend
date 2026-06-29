import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { MealConsumptionEntity } from '../entities/meal_consumption_entity';
import { MealConsumptionRepository } from '../../../domain/nutrition/repositories/meal_consumption_repository';
import { MealConsumption } from '../../../domain/nutrition/entities/meal_consumption';

export class MealConsumptionRepositoryImpl
  implements MealConsumptionRepository
{
  private get repo(): Repository<MealConsumptionEntity> {
    return AppDataSource.getRepository(MealConsumptionEntity);
  }

  private toDomain(entity: MealConsumptionEntity): MealConsumption {
    const consumption = new MealConsumption();
    consumption.id = entity.id;
    consumption.patientId = entity.patientId;
    consumption.mealId = entity.mealId;
    consumption.consumptionDate = entity.consumptionDate;
    consumption.consumed = entity.consumed;
    consumption.substitutedRecipeId = entity.substitutedRecipeId;
    consumption.notes = entity.notes;
    consumption.createdAt = entity.createdAt;
    consumption.updatedAt = entity.updatedAt;
    return consumption;
  }

  private toEntity(domain: MealConsumption): MealConsumptionEntity {
    const entity = new MealConsumptionEntity();
    entity.id = domain.id;
    entity.patientId = domain.patientId;
    entity.mealId = domain.mealId;
    entity.consumptionDate = domain.consumptionDate;
    entity.consumed = domain.consumed;
    entity.substitutedRecipeId = domain.substitutedRecipeId;
    entity.notes = domain.notes;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  async findByPatientMealDate(
    patientId: string,
    mealId: string,
    consumptionDate: Date
  ): Promise<MealConsumption | null> {
    const dateOnly = consumptionDate.toISOString().split('T')[0];
    const entity = await this.repo.findOne({
      where: { patientId, mealId, consumptionDate: dateOnly as unknown as Date },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findHistory(
    patientId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MealConsumption[]> {
    const entities = await this.repo
      .createQueryBuilder('mc')
      .where('mc.patient_id = :patientId', { patientId })
      .andWhere('mc.consumption_date >= :startDate', {
        startDate: startDate.toISOString().split('T')[0],
      })
      .andWhere('mc.consumption_date <= :endDate', {
        endDate: endDate.toISOString().split('T')[0],
      })
      .orderBy('mc.consumption_date', 'ASC')
      .getMany();

    return entities.map(this.toDomain);
  }

  async save(consumption: MealConsumption): Promise<MealConsumption> {
    const entity = this.toEntity(consumption);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }
}