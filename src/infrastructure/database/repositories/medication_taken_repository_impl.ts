import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { MedicationTakenEntity } from '../entities/medication_taken_entity';
import { MedicationTakenRepository } from '../../../domain/medication/repositories/medication_taken_repository';
import { MedicationTaken } from '../../../domain/medication/entities/medication_taken';

export class MedicationTakenRepositoryImpl implements MedicationTakenRepository {
  private get repo(): Repository<MedicationTakenEntity> {
    return AppDataSource.getRepository(MedicationTakenEntity);
  }

  private toDomain(entity: MedicationTakenEntity): MedicationTaken {
    const taken = new MedicationTaken();
    taken.id = entity.id;
    taken.reminderId = entity.reminderId;
    taken.scheduledDatetime = entity.scheduledDatetime;
    taken.taken = entity.taken;
    taken.takenAt = entity.takenAt;
    taken.createdAt = entity.createdAt;
    return taken;
  }

  private toEntity(domain: MedicationTaken): MedicationTakenEntity {
    const entity = new MedicationTakenEntity();
    entity.id = domain.id;
    entity.reminderId = domain.reminderId;
    entity.scheduledDatetime = domain.scheduledDatetime;
    entity.taken = domain.taken;
    entity.takenAt = domain.takenAt;
    entity.createdAt = domain.createdAt;
    return entity;
  }

  async findById(id: string): Promise<MedicationTaken | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByReminder(reminderId: string): Promise<MedicationTaken[]> {
    const entities = await this.repo.find({ where: { reminderId } });
    return entities.map(this.toDomain);
  }

  async findPendingToday(patientId: string): Promise<MedicationTaken[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const entities = await this.repo
      .createQueryBuilder('mt')
      .innerJoin('medications', 'm', 'm.id = (SELECT r.medication_id FROM reminders r WHERE r.id = mt.reminder_id)')
      .where('m.patient_id = :patientId', { patientId })
      .andWhere('mt.scheduled_datetime >= :startOfDay', { startOfDay: startOfDay.toISOString() })
      .andWhere('mt.scheduled_datetime < :endOfDay', { endOfDay: endOfDay.toISOString() })
      .andWhere('mt.taken = false')
      .orderBy('mt.scheduled_datetime', 'ASC')
      .getMany();

    return entities.map(this.toDomain);
  }

  async save(taken: MedicationTaken): Promise<MedicationTaken> {
    const entity = this.toEntity(taken);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }
}