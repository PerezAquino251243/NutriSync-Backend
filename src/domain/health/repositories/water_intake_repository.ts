import { WaterIntake } from '../entities/water_intake';

export interface WaterIntakeRepository {
  findByPatientDate(
    patientId: string,
    intakeDate: Date
  ): Promise<WaterIntake | null>;
  findByPatient(
    patientId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<WaterIntake[]>;
  save(intake: WaterIntake): Promise<WaterIntake>;
}