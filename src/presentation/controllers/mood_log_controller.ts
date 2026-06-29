import { Request, Response, NextFunction } from 'express';
import { MoodLogService } from '../../application/health/services/mood_log_service';
import { CreateMoodLogSchema } from '../../application/health/dtos/create_mood_log_dto';

export class MoodLogController {
  private moodLogService: MoodLogService;

  constructor() {
    this.moodLogService = new MoodLogService();
  }

  createOrUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patientId = req.user!.id;
      const validatedData = CreateMoodLogSchema.parse(req.body);
      const result = await this.moodLogService.createOrUpdateLog(
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

  getLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = req.user!.id;
      const { startDate, endDate } = req.query;

      const result = await this.moodLogService.getLogs(
        patientId,
        startDate as string | undefined,
        endDate as string | undefined
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { logId } = req.params;
      const { comment } = req.body;

      if (!comment) {
        res.status(400).json({
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'El comentario es requerido',
        });
        return;
      }

      const result = await this.moodLogService.addNutritionistComment(
        logId,
        comment
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