import { WaterIntake } from '../../../domain/health/entities/water_intake';
import { WaterIntakeRepository } from '../../../domain/health/repositories/water_intake_repository';
import { WaterIntakeRepositoryImpl } from '../../../infrastructure/database/repositories/water_intake_repository_impl';
import { CreateWaterIntakeDto } from '../dtos/create_water_intake_dto';
import { WaterGlasses } from '../../../domain/shared/value_objects/water_glasses';
import { AppError } from '../../../domain/shared/exceptions/app_error';

export class WaterIntakeService {
  private get waterIntakeRepo(): WaterIntakeRepository {
    return new WaterIntakeRepositoryImpl();
  }

  async registerIntake(
    patientId: string,
    data: CreateWaterIntakeDto
  ): Promise<WaterIntake> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const intakeDate = data.intakeDate ? new Date(data.intakeDate) : today;
    intakeDate.setHours(0, 0, 0, 0);

    if (intakeDate > today) {
      throw new AppError(
        'No se puede registrar consumo de agua a futuro',
        400,
        'FUTURE_INTAKE_DATE'
      );
    }

    let glasses: number;

    if (data.amountMl !== undefined) {
      glasses = WaterGlasses.fromMl(data.amountMl);
    } else if (data.glasses !== undefined) {
      if (!WaterGlasses.isValidGlasses(data.glasses)) {
        throw new AppError(
          'Número de vasos inválido (entero >= 0)',
          400,
          'INVALID_GLASSES'
        );
      }
      glasses = data.glasses;
    } else {
      throw new AppError(
        'Debe proporcionar glasses o amountMl',
        400,
        'MISSING_INTAKE'
      );
    }

    const existing = await this.waterIntakeRepo.findByPatientDate(
      patientId,
      intakeDate
    );

    if (existing) {
      existing.glasses = glasses;
      return this.waterIntakeRepo.save(existing);
    }

    const intake = new WaterIntake();
    intake.patientId = patientId;
    intake.intakeDate = intakeDate;
    intake.glasses = glasses;

    return this.waterIntakeRepo.save(intake);
  }

  async getStreak(
    patientId: string
  ): Promise<{
    currentStreak: number;
    maxStreak: number;
    lastIntakeDate: string | null;
  }> {
    const intakes = await this.waterIntakeRepo.findByPatient(patientId);

    if (intakes.length === 0) {
      return { currentStreak: 0, maxStreak: 0, lastIntakeDate: null };
    }

    const sorted = intakes
      .filter((i) => i.glasses > 0)
      .sort(
        (a, b) =>
          new Date(b.intakeDate).getTime() - new Date(a.intakeDate).getTime()
      );

    if (sorted.length === 0) {
      return { currentStreak: 0, maxStreak: 0, lastIntakeDate: null };
    }

    // Calcular racha actual
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = sorted.map(
      (i) => new Date(i.intakeDate).toISOString().split('T')[0]
    );

    let currentStreak = 0;
    let maxStreak = 1;
    let streak = 1;

    // Calcular desde hoy hacia atrás
    const todayStr = today.toISOString().split('T')[0];

    if (dates[0] === todayStr || dates[0] === this.yesterday(today)) {
      currentStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevDateStr = prevDate.toISOString().split('T')[0];

        if (dates[i] === prevDateStr) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calcular max streak
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateStr = prevDate.toISOString().split('T')[0];

      if (dates[i] === prevDateStr) {
        streak++;
      } else {
        streak = 1;
      }

      if (streak > maxStreak) {
        maxStreak = streak;
      }
    }

    return {
      currentStreak,
      maxStreak,
      lastIntakeDate: sorted[0].intakeDate.toISOString().split('T')[0],
    };
  }

  private yesterday(date: Date): string {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  async getHistory(
    patientId: string,
    startDate: string,
    endDate: string
  ): Promise<WaterIntake[]> {
    return this.waterIntakeRepo.findByPatient(
      patientId,
      new Date(startDate),
      new Date(endDate)
    );
  }
}