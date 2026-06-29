import { DietPlan } from '../entities/diet_plan';

export interface DietPlanRepository {
  findById(id: string): Promise<DietPlan | null>;
  findByNutritionist(nutritionistId: string): Promise<DietPlan[]>;
  save(plan: DietPlan): Promise<DietPlan>;
  softDelete(id: string): Promise<void>;
}