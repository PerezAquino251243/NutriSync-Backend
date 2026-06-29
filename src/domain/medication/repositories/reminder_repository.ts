import { Reminder } from '../entities/reminder';

export interface ReminderRepository {
  findByMedication(medicationId: string): Promise<Reminder[]>;
  findById(id: string): Promise<Reminder | null>;
  save(reminder: Reminder): Promise<Reminder>;
}