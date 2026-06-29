import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { MoodLogEntity } from '../entities/mood_log_entity';
import { MoodLogRepository } from '../../../domain/health/repositories/mood_log_repository';
import { MoodLog } from '../../../domain/health/entities/mood_log';

export class MoodLogRepositoryImpl implements MoodLogRepository {
  private get repo(): Repository<MoodLogEntity> {
    return AppDataSource.getRepository(MoodLogEntity);
  }

  private toDomain(entity: MoodLogEntity): MoodLog {
    const log = new MoodLog();
    log.id = entity.id;
    log.patientId = entity.patientId;
    log.logDate = entity.logDate;
    log.moodType = entity.moodType;
    log.patientComment = entity.patientComment;
    log.nutritionistComment = entity.nutritionistComment;
    log.createdAt = entity.createdAt;
    log.updatedAt = entity.updatedAt;
    return log;
  }

  private toEntity(domain: MoodLog): MoodLogEntity {
    const entity = new MoodLogEntity();
    entity.id = domain.id;
    entity.patientId = domain.patientId;
    entity.logDate = domain.logDate;
    entity.moodType = domain.moodType;
    entity.patientComment = domain.patientComment;
    entity.nutritionistComment = domain.nutritionistComment;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  async findByPatientDate(
    patientId: string,
    logDate: Date
  ): Promise<MoodLog | null> {
    const dateOnly = logDate.toISOString().split('T')[0];
    const entity = await this.repo.findOne({
      where: { patientId, logDate: dateOnly as unknown as Date },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findById(id: string): Promise<MoodLog | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByPatient(
    patientId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<MoodLog[]> {
    const qb = this.repo
      .createQueryBuilder('ml')
      .where('ml.patient_id = :patientId', { patientId });

    if (startDate) {
      qb.andWhere('ml.log_date >= :startDate', {
        startDate: startDate.toISOString().split('T')[0],
      });
    }

    if (endDate) {
      qb.andWhere('ml.log_date <= :endDate', {
        endDate: endDate.toISOString().split('T')[0],
      });
    }

    qb.orderBy('ml.log_date', 'DESC');

    const entities = await qb.getMany();
    return entities.map(this.toDomain);
  }

  async save(log: MoodLog): Promise<MoodLog> {
    const entity = this.toEntity(log);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }
}