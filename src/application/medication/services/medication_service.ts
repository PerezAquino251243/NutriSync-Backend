import { Medication } from '../../../domain/medication/entities/medication';
import { Reminder } from '../../../domain/medication/entities/reminder';
import { MedicationTaken } from '../../../domain/medication/entities/medication_taken';
import { MedicationRepository } from '../../../domain/medication/repositories/medication_repository';
import { MedicationRepositoryImpl } from '../../../infrastructure/database/repositories/medication_repository_impl';
import { ReminderRepository } from '../../../domain/medication/repositories/reminder_repository';
import { ReminderRepositoryImpl } from '../../../infrastructure/database/repositories/reminder_repository_impl';
import { MedicationTakenRepository } from '../../../domain/medication/repositories/medication_taken_repository';
import { MedicationTakenRepositoryImpl } from '../../../infrastructure/database/repositories/medication_taken_repository_impl';
import { CreateMedicationDto } from '../dtos/create_medication_dto';
import { AppError } from '../../../domain/shared/exceptions/app_error';

export class MedicationService {
  private get medicationRepo(): MedicationRepository {
    return new MedicationRepositoryImpl();
  }

  private get reminderRepo(): ReminderRepository {
    return new ReminderRepositoryImpl();
  }

  private get takenRepo(): MedicationTakenRepository {
    return new MedicationTakenRepositoryImpl();
  }

  async createMedication(
    patientId: string,
    data: CreateMedicationDto
  ): Promise<{ medication: Medication; reminders: Reminder[] }> {
    const medication = new Medication();
    medication.patientId = patientId;
    medication.name = data.name;
    medication.dosage = data.dosage;
    medication.active = data.active;

    const savedMedication = await this.medicationRepo.save(medication);

    const reminders: Reminder[] = [];

    for (const reminderData of data.reminders) {
      const reminder = new Reminder();
      reminder.medicationId = savedMedication.id;
      reminder.intervalHours = reminderData.intervalHours;
      reminder.daysOfWeek = reminderData.daysOfWeek;
      reminder.startTime = reminderData.startTime;
      reminder.active = reminderData.active;

      const savedReminder = await this.reminderRepo.save(reminder);
      reminders.push(savedReminder);
    }

    return { medication: savedMedication, reminders };
  }

  async markTaken(
    patientId: string,
    takenId: string,
    taken: boolean
  ): Promise<MedicationTaken> {
    const record = await this.takenRepo.findById(takenId);
    if (!record) {
      throw new AppError('Registro no encontrado', 404, 'TAKEN_NOT_FOUND');
    }

    // RN-032: No se puede marcar una dosis futura
    const now = new Date();
    if (record.scheduledDatetime > now) {
      throw new AppError(
        'No se puede marcar una dosis programada a futuro',
        400,
        'FUTURE_DOSE'
      );
    }

    record.taken = taken;
    record.takenAt = taken ? now : undefined;

    return this.takenRepo.save(record);
  }

  async getPendingDoses(patientId: string): Promise<MedicationTaken[]> {
    return this.takenRepo.findPendingToday(patientId);
  }

  async getMedications(
    patientId: string
  ): Promise<
    Array<{ medication: Medication; reminders: Reminder[] }>
  > {
    const medications = await this.medicationRepo.findByPatient(patientId);

    const result: Array<{ medication: Medication; reminders: Reminder[] }> = [];

    for (const medication of medications) {
      if (medication.active) {
        const reminders = await this.reminderRepo.findByMedication(
          medication.id
        );
        result.push({ medication, reminders });
      }
    }

    return result;
  }
}