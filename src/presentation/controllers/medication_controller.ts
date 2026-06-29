import { Request, Response, NextFunction } from 'express';
import { MedicationService } from '../../application/medication/services/medication_service';
import { CreateMedicationSchema } from '../../application/medication/dtos/create_medication_dto';
import { MarkTakenSchema } from '../../application/medication/dtos/mark_taken_dto';

export class MedicationController {
  private medicationService: MedicationService;

  constructor() {
    this.medicationService = new MedicationService();
  }

  getMedications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patientId = req.user!.id;
      const result = await this.medicationService.getMedications(patientId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  createMedication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patientId = req.user!.id;
      const validatedData = CreateMedicationSchema.parse(req.body);
      const result = await this.medicationService.createMedication(
        patientId,
        validatedData
      );

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  markTaken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = req.user!.id;
      const { id: takenId } = req.params;
      const validatedData = MarkTakenSchema.parse(req.body);

      const result = await this.medicationService.markTaken(
        patientId,
        takenId,
        validatedData.taken
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