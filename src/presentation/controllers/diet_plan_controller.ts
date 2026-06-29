import { Request, Response, NextFunction } from 'express';
import { DietPlanService } from '../../application/nutrition/services/diet_plan_service';
import { CreateDietPlanSchema } from '../../application/nutrition/dtos/create_diet_plan_dto';
import { AssignPlanSchema } from '../../application/nutrition/dtos/assign_plan_dto';

export class DietPlanController {
  private dietPlanService: DietPlanService;

  constructor() {
    this.dietPlanService = new DietPlanService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nutritionistId = req.user!.id;
      const validatedData = CreateDietPlanSchema.parse(req.body);
      const plan = await this.dietPlanService.create(
        nutritionistId,
        validatedData
      );

      res.status(201).json({
        success: true,
        data: plan,
      });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nutritionistId = req.user!.id;
      const plans = await this.dietPlanService.listByNutritionist(
        nutritionistId
      );

      res.status(200).json({
        success: true,
        data: plans,
      });
    } catch (error) {
      next(error);
    }
  };

  assign = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nutritionistId = req.user!.id;
      const { id: planId } = req.params;
      const validatedData = AssignPlanSchema.parse(req.body);

      const assignment = await this.dietPlanService.assignToPatient(
        planId,
        validatedData.patientId,
        nutritionistId
      );

      res.status(201).json({
        success: true,
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  };
}