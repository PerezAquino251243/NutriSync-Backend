import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { ReminderEntity } from '../entities/reminder_entity';
import { ReminderRepository } from '../../../domain/medication/repositories/reminder_repository';
import { Reminder } from '../../../domain/medication/entities/reminder';

export class ReminderRepositoryImpl implements ReminderRepository {
  private get repo(): Repository<ReminderEntity> {
    return AppDataSource.getRepository(ReminderEntity);
  }

  private toDomain(entity: ReminderEntity): Reminder {
    const reminder = new Reminder();
    reminder.id = entity.id;
    reminder.medicationId = entity.medicationId;
    reminder.intervalHours = entity.intervalHours;
    reminder.daysOfWeek = entity.daysOfWeek;
    reminder.startTime = entity.startTime;
    reminder.active = entity.active;
    reminder.createdAt = entity.createdAt;
    reminder.updatedAt = entity.updatedAt;
    return reminder;
  }

  private toEntity(domain: Reminder): ReminderEntity {
    const entity = new ReminderEntity();
    entity.id = domain.id;
    entity.medicationId = domain.medicationId;
    entity.intervalHours = domain.intervalHours;
    entity.daysOfWeek = domain.daysOfWeek;
    entity.startTime = domain.startTime;
    entity.active = domain.active;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  async findByMedication(medicationId: string): Promise<Reminder[]> {
    const entities = await this.repo.find({ where: { medicationId } });
    return entities.map(this.toDomain);
  }

  async findById(id: string): Promise<Reminder | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async save(reminder: Reminder): Promise<Reminder> {
    const entity = this.toEntity(reminder);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }
}