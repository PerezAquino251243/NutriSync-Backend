import { MealConsumption } from '../../../domain/nutrition/entities/meal_consumption';
import { MealConsumptionRepository } from '../../../domain/nutrition/repositories/meal_consumption_repository';
import { MealConsumptionRepositoryImpl } from '../../../infrastructure/database/repositories/meal_consumption_repository_impl';
import { MealRepository } from '../../../domain/nutrition/repositories/meal_repository';
import { MealRepositoryImpl } from '../../../infrastructure/database/repositories/meal_repository_impl';
import { RecipeRepository } from '../../../domain/nutrition/repositories/recipe_repository';
import { RecipeRepositoryImpl } from '../../../infrastructure/database/repositories/recipe_repository_impl';
import { PatientPlanAssignmentRepository } from '../../../domain/nutrition/repositories/patient_plan_assignment_repository';
import { PatientPlanAssignmentRepositoryImpl } from '../../../infrastructure/database/repositories/patient_plan_assignment_repository_impl';
import { DietPlanRepository } from '../../../domain/nutrition/repositories/diet_plan_repository';
import { DietPlanRepositoryImpl } from '../../../infrastructure/database/repositories/diet_plan_repository_impl';
import { CreateMealConsumptionDto } from '../dtos/create_meal_consumption_dto';
import { AppError } from '../../../domain/shared/exceptions/app_error';

export class MealConsumptionService {
  private get consumptionRepo(): MealConsumptionRepository {
    return new MealConsumptionRepositoryImpl();
  }

  private get mealRepo(): MealRepository {
    return new MealRepositoryImpl();
  }

  private get recipeRepo(): RecipeRepository {
    return new RecipeRepositoryImpl();
  }

  private get assignmentRepo(): PatientPlanAssignmentRepository {
    return new PatientPlanAssignmentRepositoryImpl();
  }

  private get planRepo(): DietPlanRepository {
    return new DietPlanRepositoryImpl();
  }

  async markConsumption(
    patientId: string,
    mealId: string,
    data: CreateMealConsumptionDto
  ): Promise<MealConsumption> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const consumptionDate = data.consumptionDate
      ? new Date(data.consumptionDate)
      : today;

    consumptionDate.setHours(0, 0, 0, 0);

    // RN-021: No se puede registrar consumo a futuro
    if (consumptionDate > today) {
      throw new AppError(
        'No se puede registrar consumo en una fecha futura',
        400,
        'FUTURE_CONSUMPTION_DATE'
      );
    }

    // Obtener meal por ID
    const meal = await this.mealRepo.findById(mealId);
    if (!meal) {
      throw new AppError('Comida no encontrada', 404, 'MEAL_NOT_FOUND');
    }

    const assignments = await this.assignmentRepo.findByPatient(patientId);

    if (assignments.length === 0) {
      throw new AppError(
        'No tienes un plan asignado',
        404,
        'NO_PLAN_ASSIGNED'
      );
    }

    // Encontrar el plan activo
    let activePlanId: string | null = null;
    for (const assignment of assignments) {
      const plan = await this.planRepo.findById(assignment.dietPlanId);
      if (plan && plan.isActive && !plan.deletedAt) {
        activePlanId = plan.id;
        break;
      }
    }

    if (!activePlanId) {
      throw new AppError(
        'No tienes un plan activo',
        404,
        'NO_ACTIVE_PLAN'
      );
    }

    // Obtener meals del plan activo y verificar que el meal pertenece al plan
    const planMeals = await this.mealRepo.findByDietPlan(activePlanId);
    const targetMeal = planMeals.find((m) => m.id === mealId);

    if (!targetMeal) {
      throw new AppError(
        'La comida no pertenece a tu plan activo',
        403,
        'MEAL_NOT_IN_PLAN'
      );
    }

    // Verificar receta sustituida si se proporciona
    if (data.substitutedRecipeId) {
      const recipe = await this.recipeRepo.findById(data.substitutedRecipeId);
      if (!recipe) {
        throw new AppError(
          'Receta de sustitución no encontrada',
          404,
          'RECIPE_NOT_FOUND'
        );
      }
    }

    // Upsert: buscar existente
    const existing = await this.consumptionRepo.findByPatientMealDate(
      patientId,
      mealId,
      consumptionDate
    );

    if (existing) {
      existing.consumed = data.consumed;
      existing.substitutedRecipeId = data.substitutedRecipeId;
      existing.notes = data.notes;
      return this.consumptionRepo.save(existing);
    }

    const consumption = new MealConsumption();
    consumption.patientId = patientId;
    consumption.mealId = mealId;
    consumption.consumptionDate = consumptionDate;
    consumption.consumed = data.consumed;
    consumption.substitutedRecipeId = data.substitutedRecipeId;
    consumption.notes = data.notes;

    return this.consumptionRepo.save(consumption);
  }

  async getHistory(
    patientId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MealConsumption[]> {
    return this.consumptionRepo.findHistory(patientId, startDate, endDate);
  }

  async calculateAdherence(patientId: string): Promise<{
    expected: number;
    consumed: number;
    adherence: number;
  }> {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

    const endDate = today;

    // Obtener plan activo
    const assignments = await this.assignmentRepo.findByPatient(patientId);
    let activePlanId: string | null = null;

    for (const assignment of assignments) {
      const plan = await this.planRepo.findById(assignment.dietPlanId);
      if (plan && plan.isActive && !plan.deletedAt) {
        activePlanId = plan.id;
        break;
      }
    }

    if (!activePlanId) {
      return { expected: 0, consumed: 0, adherence: 0 };
    }

    // Contar comidas en el plan
    const planMeals = await this.mealRepo.findByDietPlan(activePlanId);
    const mealsPerDay = planMeals.length;

    // Días en la ventana
    const diffTime = endDate.getTime() - startDate.getTime();
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const expected = days * mealsPerDay;

    // Contar consumos reales
    const consumptions = await this.consumptionRepo.findHistory(
      patientId,
      startDate,
      endDate
    );

    const consumed = consumptions.filter((c) => c.consumed).length;

    const adherence = expected > 0 ? (consumed / expected) * 100 : 0;

    return { expected, consumed, adherence: Math.round(adherence * 100) / 100 };
  }
}