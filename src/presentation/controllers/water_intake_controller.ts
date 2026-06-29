import { Request, Response, NextFunction } from 'express';
import { WaterIntakeService } from '../../application/health/services/water_intake_service';
import { CreateWaterIntakeSchema } from '../../application/health/dtos/create_water_intake_dto';

export class WaterIntakeController {
  private waterIntakeService: WaterIntakeService;

  constructor() {
    this.waterIntakeService = new WaterIntakeService();
  }

  registerIntake = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patientId = req.user!.id;
      const validatedData = CreateWaterIntakeSchema.parse(req.body);
      const result = await this.waterIntakeService.registerIntake(
        patientId,
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

  getStreak = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = req.user!.id;
      const result = await this.waterIntakeService.getStreak(patientId);

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

      const result = await this.waterIntakeService.getHistory(
        patientId,
        startDate as string,
        endDate as string
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