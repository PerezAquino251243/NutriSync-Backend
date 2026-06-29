import { MealConsumption } from '../entities/meal_consumption';

export interface MealConsumptionRepository {
  findByPatientMealDate(
    patientId: string,
    mealId: string,
    consumptionDate: Date
  ): Promise<MealConsumption | null>;
  findHistory(
    patientId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MealConsumption[]>;
  save(consumption: MealConsumption): Promise<MealConsumption>;
}