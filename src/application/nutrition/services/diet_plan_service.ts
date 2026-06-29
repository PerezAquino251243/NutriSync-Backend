import { DietPlan } from '../../../domain/nutrition/entities/diet_plan';
import { PatientPlanAssignment } from '../../../domain/nutrition/entities/patient_plan_assignment';
import { DietPlanRepository } from '../../../domain/nutrition/repositories/diet_plan_repository';
import { DietPlanRepositoryImpl } from '../../../infrastructure/database/repositories/diet_plan_repository_impl';
import { PatientPlanAssignmentRepository } from '../../../domain/nutrition/repositories/patient_plan_assignment_repository';
import { PatientPlanAssignmentRepositoryImpl } from '../../../infrastructure/database/repositories/patient_plan_assignment_repository_impl';
import { CreateDietPlanDto } from '../dtos/create_diet_plan_dto';
import { AppError } from '../../../domain/shared/exceptions/app_error';

export class DietPlanService {
  private get planRepo(): DietPlanRepository {
    return new DietPlanRepositoryImpl();
  }

  private get assignmentRepo(): PatientPlanAssignmentRepository {
    return new PatientPlanAssignmentRepositoryImpl();
  }

  async create(
    nutritionistId: string,
    data: CreateDietPlanDto
  ): Promise<DietPlan> {
    const plan = new DietPlan();
    plan.name = data.name;
    plan.targetCalories = data.targetCalories;
    plan.nutritionistId = nutritionistId;
    plan.isActive = true;

    return this.planRepo.save(plan);
  }

  async listByNutritionist(nutritionistId: string): Promise<DietPlan[]> {
    return this.planRepo.findByNutritionist(nutritionistId);
  }

  async assignToPatient(
    planId: string,
    patientId: string,
    nutritionistId: string
  ): Promise<PatientPlanAssignment> {
    const plan = await this.planRepo.findById(planId);
    if (!plan) {
      throw new AppError('Plan no encontrado', 404, 'PLAN_NOT_FOUND');
    }

    if (plan.nutritionistId !== nutritionistId) {
      throw new AppError(
        'No tienes permiso sobre este plan',
        403,
        'FORBIDDEN'
      );
    }

    const existing = await this.assignmentRepo.findByPlanAndPatient(
      planId,
      patientId
    );
    if (existing) {
      throw new AppError(
        'El plan ya está asignado a este paciente',
        409,
        'ALREADY_ASSIGNED'
      );
    }

    const assignment = new PatientPlanAssignment();
    assignment.dietPlanId = planId;
    assignment.patientId = patientId;

    return this.assignmentRepo.save(assignment);
  }
}