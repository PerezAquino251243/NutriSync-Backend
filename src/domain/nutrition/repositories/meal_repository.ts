import { Meal } from '../entities/meal';

export interface MealRepository {
  findById(id: string): Promise<Meal | null>;
  findByDietPlan(dietPlanId: string): Promise<Meal[]>;
  save(meal: Meal): Promise<Meal>;
  delete(id: string): Promise<void>;
}
