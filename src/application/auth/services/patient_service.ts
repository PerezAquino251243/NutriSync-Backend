import * as argon2 from 'argon2';
import { User } from '../../../domain/auth/entities/user';
import { PatientProfile } from '../../../domain/auth/entities/patient_profile';
import { UserRepository } from '../../../domain/auth/repositories/user_repository';
import { UserRepositoryImpl } from '../../../infrastructure/database/repositories/user_repository_impl';
import { PatientProfileRepository } from '../../../domain/auth/repositories/patient_profile_repository';
import { PatientProfileRepositoryImpl } from '../../../infrastructure/database/repositories/patient_profile_repository_impl';
import { CreatePatientDto } from '../dtos/create_patient_dto';
import { UpdatePatientDto } from '../dtos/update_patient_dto';
import { AppError } from '../../../domain/shared/exceptions/app_error';

export class PatientService {
  private get userRepo(): UserRepository {
    return new UserRepositoryImpl();
  }

  private get profileRepo(): PatientProfileRepository {
    return new PatientProfileRepositoryImpl();
  }

  async createPatient(
    nutritionistId: string,
    data: CreatePatientDto
  ): Promise<{ user: User; profile: PatientProfile }> {
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('El email ya está registrado', 409, 'EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await argon2.hash(data.password);

    const user = new User();
    user.email = data.email;
    user.passwordHash = passwordHash;
    user.name = data.name;
    user.role = 'patient';

    const savedUser = await this.userRepo.save(user);

    const profile = new PatientProfile();
    profile.userId = savedUser.id;
    profile.phone = data.phone;
    profile.birthDate = data.birthDate ? new Date(data.birthDate) : undefined;
    profile.nutritionistId = nutritionistId;

    const savedProfile = await this.profileRepo.save(profile);

    return { user: savedUser, profile: savedProfile };
  }

  async findByNutritionist(
    nutritionistId: string
  ): Promise<Array<{ user: User; profile: PatientProfile }>> {
    const profiles = await this.profileRepo.findByNutritionist(nutritionistId);

    const result: Array<{ user: User; profile: PatientProfile }> = [];

    for (const profile of profiles) {
      const user = await this.userRepo.findById(profile.userId);
      if (user && !user.deletedAt) {
        result.push({ user, profile });
      }
    }

    return result;
  }

  async findById(
    patientId: string
  ): Promise<{ user: User; profile: PatientProfile } | null> {
    const user = await this.userRepo.findById(patientId);
    if (!user || user.deletedAt) {
      throw new AppError('Paciente no encontrado', 404, 'PATIENT_NOT_FOUND');
    }

    const profile = await this.profileRepo.findByUserId(patientId);
    if (!profile) {
      throw new AppError('Perfil de paciente no encontrado', 404, 'PROFILE_NOT_FOUND');
    }

    return { user, profile };
  }

  async updatePatient(
    patientId: string,
    data: UpdatePatientDto
  ): Promise<{ user: User; profile: PatientProfile }> {
    const user = await this.userRepo.findById(patientId);
    if (!user || user.deletedAt) {
      throw new AppError('Paciente no encontrado', 404, 'PATIENT_NOT_FOUND');
    }

    const profile = await this.profileRepo.findByUserId(patientId);
    if (!profile) {
      throw new AppError('Perfil de paciente no encontrado', 404, 'PROFILE_NOT_FOUND');
    }

    if (data.name) {
      user.name = data.name;
    }

    if (data.phone !== undefined) {
      profile.phone = data.phone;
    }

    if (data.birthDate !== undefined) {
      profile.birthDate = data.birthDate ? new Date(data.birthDate) : undefined;
    }

    const savedUser = await this.userRepo.save(user);
    const savedProfile = await this.profileRepo.save(profile);

    return { user: savedUser, profile: savedProfile };
  }

  async softDeletePatient(patientId: string): Promise<void> {
    const user = await this.userRepo.findById(patientId);
    if (!user || user.deletedAt) {
      throw new AppError('Paciente no encontrado', 404, 'PATIENT_NOT_FOUND');
    }

    await this.userRepo.softDelete(patientId);
  }
}