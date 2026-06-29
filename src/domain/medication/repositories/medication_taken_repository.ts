import { MedicationTaken } from '../entities/medication_taken';

export interface MedicationTakenRepository {
  findById(id: string): Promise<MedicationTaken | null>;
  findByReminder(reminderId: string): Promise<MedicationTaken[]>;
  findPendingToday(patientId: string): Promise<MedicationTaken[]>;
  save(taken: MedicationTaken): Promise<MedicationTaken>;
}