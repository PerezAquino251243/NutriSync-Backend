import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { MedicationEntity } from '../entities/medication_entity';
import { MedicationRepository } from '../../../domain/medication/repositories/medication_repository';
import { Medication } from '../../../domain/medication/entities/medication';

export class MedicationRepositoryImpl implements MedicationRepository {
  private get repo(): Repository<MedicationEntity> {
    return AppDataSource.getRepository(MedicationEntity);
  }

  private toDomain(entity: MedicationEntity): Medication {
    const medication = new Medication();
    medication.id = entity.id;
    medication.patientId = entity.patientId;
    medication.name = entity.name;
    medication.dosage = entity.dosage;
    medication.active = entity.active;
    medication.createdAt = entity.createdAt;
    medication.updatedAt = entity.updatedAt;
    return medication;
  }

  private toEntity(domain: Medication): MedicationEntity {
    const entity = new MedicationEntity();
    entity.id = domain.id;
    entity.patientId = domain.patientId;
    entity.name = domain.name;
    entity.dosage = domain.dosage;
    entity.active = domain.active;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  async findByPatient(patientId: string): Promise<Medication[]> {
    const entities = await this.repo.find({ where: { patientId } });
    return entities.map(this.toDomain);
  }

  async findById(id: string): Promise<Medication | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async save(medication: Medication): Promise<Medication> {
    const entity = this.toEntity(medication);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }
}