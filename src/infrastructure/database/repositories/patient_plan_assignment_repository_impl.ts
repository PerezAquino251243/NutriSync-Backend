import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { PatientPlanAssignmentEntity } from '../entities/patient_plan_assignment_entity';
import { PatientPlanAssignmentRepository } from '../../../domain/nutrition/repositories/patient_plan_assignment_repository';
import { PatientPlanAssignment } from '../../../domain/nutrition/entities/patient_plan_assignment';

export class PatientPlanAssignmentRepositoryImpl
  implements PatientPlanAssignmentRepository
{
  private get repo(): Repository<PatientPlanAssignmentEntity> {
    return AppDataSource.getRepository(PatientPlanAssignmentEntity);
  }

  private toDomain(entity: PatientPlanAssignmentEntity): PatientPlanAssignment {
    const assignment = new PatientPlanAssignment();
    assignment.dietPlanId = entity.dietPlanId;
    assignment.patientId = entity.patientId;
    assignment.assignedAt = entity.assignedAt;
    return assignment;
  }

  private toEntity(domain: PatientPlanAssignment): PatientPlanAssignmentEntity {
    const entity = new PatientPlanAssignmentEntity();
    entity.dietPlanId = domain.dietPlanId;
    entity.patientId = domain.patientId;
    entity.assignedAt = domain.assignedAt;
    return entity;
  }

  async findByPlanAndPatient(
    dietPlanId: string,
    patientId: string
  ): Promise<PatientPlanAssignment | null> {
    const entity = await this.repo.findOne({
      where: { dietPlanId, patientId },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByPatient(
    patientId: string
  ): Promise<PatientPlanAssignment[]> {
    const entities = await this.repo.find({ where: { patientId } });
    return entities.map(this.toDomain);
  }

  async save(
    assignment: PatientPlanAssignment
  ): Promise<PatientPlanAssignment> {
    const entity = this.toEntity(assignment);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }
}