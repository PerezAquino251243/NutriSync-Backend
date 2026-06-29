import { Request, Response, NextFunction } from 'express';
import { MealConsumptionService } from '../../application/nutrition/services/meal_consumption_service';
import { CreateMealConsumptionSchema } from '../../application/nutrition/dtos/create_meal_consumption_dto';

export class MealConsumptionController {
  private mealConsumptionService: MealConsumptionService;

  constructor() {
    this.mealConsumptionService = new MealConsumptionService();
  }

  consume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = req.user!.id;
      const { mealId } = req.params;
      const validatedData = CreateMealConsumptionSchema.parse(req.body);

      const result = await this.mealConsumptionService.markConsumption(
        patientId,
        mealId,
        validatedData
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = req.user!.id;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'startDate y endDate son requeridos',
        });
        return;
      }

      const result = await this.mealConsumptionService.getHistory(
        patientId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getAdherence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: patientId } = req.params;
      const result = await this.mealConsumptionService.calculateAdherence(
        patientId
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}