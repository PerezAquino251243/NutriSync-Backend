import { Medication } from '../entities/medication';

export interface MedicationRepository {
  findByPatient(patientId: string): Promise<Medication[]>;
  findById(id: string): Promise<Medication | null>;
  save(medication: Medication): Promise<Medication>;
}