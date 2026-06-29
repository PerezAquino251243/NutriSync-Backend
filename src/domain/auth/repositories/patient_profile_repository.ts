import { PatientProfile } from '../entities/patient_profile';

export interface PatientProfileRepository {
  findByUserId(userId: string): Promise<PatientProfile | null>;
  findByNutritionist(nutritionistId: string): Promise<PatientProfile[]>;
  save(profile: PatientProfile): Promise<PatientProfile>;
  delete(id: string): Promise<void>;
}