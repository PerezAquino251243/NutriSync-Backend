import { PatientPlanAssignment } from '../entities/patient_plan_assignment';

export interface PatientPlanAssignmentRepository {
  findByPlanAndPatient(
    dietPlanId: string,
    patientId: string
  ): Promise<PatientPlanAssignment | null>;
  findByPatient(patientId: string): Promise<PatientPlanAssignment[]>;
  save(assignment: PatientPlanAssignment): Promise<PatientPlanAssignment>;
}