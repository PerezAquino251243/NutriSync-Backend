import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { WaterIntakeEntity } from '../entities/water_intake_entity';
import { WaterIntakeRepository } from '../../../domain/health/repositories/water_intake_repository';
import { WaterIntake } from '../../../domain/health/entities/water_intake';

export class WaterIntakeRepositoryImpl implements WaterIntakeRepository {
  private get repo(): Repository<WaterIntakeEntity> {
    return AppDataSource.getRepository(WaterIntakeEntity);
  }

  private toDomain(entity: WaterIntakeEntity): WaterIntake {
    const intake = new WaterIntake();
    intake.id = entity.id;
    intake.patientId = entity.patientId;
    intake.intakeDate = entity.intakeDate;
    intake.glasses = entity.glasses;
    intake.createdAt = entity.createdAt;
    intake.updatedAt = entity.updatedAt;
    return intake;
  }

  private toEntity(domain: WaterIntake): WaterIntakeEntity {
    const entity = new WaterIntakeEntity();
    entity.id = domain.id;
    entity.patientId = domain.patientId;
    entity.intakeDate = domain.intakeDate;
    entity.glasses = domain.glasses;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  async findByPatientDate(
    patientId: string,
    intakeDate: Date
  ): Promise<WaterIntake | null> {
    const dateOnly = intakeDate.toISOString().split('T')[0];
    const entity = await this.repo.findOne({
      where: { patientId, intakeDate: dateOnly as unknown as Date },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByPatient(
    patientId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<WaterIntake[]> {
    const qb = this.repo
      .createQueryBuilder('wi')
      .where('wi.patient_id = :patientId', { patientId });

    if (startDate) {
      qb.andWhere('wi.intake_date >= :startDate', {
        startDate: startDate.toISOString().split('T')[0],
      });
    }

    if (endDate) {
      qb.andWhere('wi.intake_date <= :endDate', {
        endDate: endDate.toISOString().split('T')[0],
      });
    }

    qb.orderBy('wi.intake_date', 'DESC');

    const entities = await qb.getMany();
    return entities.map(this.toDomain);
  }

  async save(intake: WaterIntake): Promise<WaterIntake> {
    const entity = this.toEntity(intake);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }
}