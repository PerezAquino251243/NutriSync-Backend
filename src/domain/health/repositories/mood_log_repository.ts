import { MoodLog } from '../entities/mood_log';

export interface MoodLogRepository {
  findByPatientDate(
    patientId: string,
    logDate: Date
  ): Promise<MoodLog | null>;
  findById(id: string): Promise<MoodLog | null>;
  findByPatient(
    patientId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<MoodLog[]>;
  save(log: MoodLog): Promise<MoodLog>;
}