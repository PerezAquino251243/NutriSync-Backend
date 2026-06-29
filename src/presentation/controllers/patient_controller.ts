import { Request, Response, NextFunction } from 'express';
import { PatientService } from '../../application/auth/services/patient_service';
import { CreatePatientSchema } from '../../application/auth/dtos/create_patient_dto';
import { UpdatePatientSchema } from '../../application/auth/dtos/update_patient_dto';

export class PatientController {
  private patientService: PatientService;

  constructor() {
    this.patientService = new PatientService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nutritionistId = req.user!.id;
      const validatedData = CreatePatientSchema.parse(req.body);
      const result = await this.patientService.createPatient(
        nutritionistId,
        validatedData
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
          },
          profile: {
            id: result.profile.id,
            phone: result.profile.phone,
            birthDate: result.profile.birthDate,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nutritionistId = req.user!.id;
      const patients = await this.patientService.findByNutritionist(
        nutritionistId
      );

      res.status(200).json({
        success: true,
        data: patients.map((p) => ({
          user: {
            id: p.user.id,
            email: p.user.email,
            name: p.user.name,
            role: p.user.role,
            createdAt: p.user.createdAt,
          },
          profile: {
            id: p.profile.id,
            phone: p.profile.phone,
            birthDate: p.profile.birthDate,
          },
        })),
      });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.patientService.findById(id);

      if (!result) {
        res.status(404).json({
          success: false,
          code: 'PATIENT_NOT_FOUND',
          message: 'Paciente no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            createdAt: result.user.createdAt,
          },
          profile: {
            id: result.profile.id,
            phone: result.profile.phone,
            birthDate: result.profile.birthDate,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const validatedData = UpdatePatientSchema.parse(req.body);
      const result = await this.patientService.updatePatient(
        id,
        validatedData
      );

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
          },
          profile: {
            id: result.profile.id,
            phone: result.profile.phone,
            birthDate: result.profile.birthDate,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.patientService.softDeletePatient(id);

      res.status(200).json({
        success: true,
        message: 'Paciente eliminado correctamente',
      });
    } catch (error) {
      next(error);
    }
  };
}