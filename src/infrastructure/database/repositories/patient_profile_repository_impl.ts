import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { PatientProfileEntity } from '../entities/patient_profile_entity';
import { PatientProfileRepository } from '../../../domain/auth/repositories/patient_profile_repository';
import { PatientProfile } from '../../../domain/auth/entities/patient_profile';

export class PatientProfileRepositoryImpl implements PatientProfileRepository {
  private get repo(): Repository<PatientProfileEntity> {
    return AppDataSource.getRepository(PatientProfileEntity);
  }

  private toDomain(entity: PatientProfileEntity): PatientProfile {
    const profile = new PatientProfile();
    profile.id = entity.id;
    profile.userId = entity.userId;
    profile.phone = entity.phone;
    profile.birthDate = entity.birthDate;
    profile.nutritionistId = entity.nutritionistId;
    profile.createdAt = entity.createdAt;
    profile.updatedAt = entity.updatedAt;
    return profile;
  }

  private toEntity(domain: PatientProfile): PatientProfileEntity {
    const entity = new PatientProfileEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.phone = domain.phone;
    entity.birthDate = domain.birthDate;
    entity.nutritionistId = domain.nutritionistId;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  async findByUserId(userId: string): Promise<PatientProfile | null> {
    const entity = await this.repo.findOne({ where: { userId } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByNutritionist(nutritionistId: string): Promise<PatientProfile[]> {
    const entities = await this.repo.find({ where: { nutritionistId } });
    return entities.map(this.toDomain);
  }

  async save(profile: PatientProfile): Promise<PatientProfile> {
    const entity = this.toEntity(profile);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}