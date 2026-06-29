import { MoodLog } from '../../../domain/health/entities/mood_log';
import { MoodLogRepository } from '../../../domain/health/repositories/mood_log_repository';
import { MoodLogRepositoryImpl } from '../../../infrastructure/database/repositories/mood_log_repository_impl';
import { CreateMoodLogDto } from '../dtos/create_mood_log_dto';
import { AppError } from '../../../domain/shared/exceptions/app_error';

const MOOD_MAP: Record<string, number> = {
  excellent: 1,
  good: 2,
  neutral: 3,
  bad: 4,
};

export class MoodLogService {
  private get moodLogRepo(): MoodLogRepository {
    return new MoodLogRepositoryImpl();
  }

  private mapMoodStringToInt(mood: string | number): number {
    if (typeof mood === 'number') {
      if (mood < 1 || mood > 4 || !Number.isInteger(mood)) {
        throw new AppError('Tipo de ánimo inválido (1-4)', 400, 'INVALID_MOOD');
      }
      return mood;
    }

    const mapped = MOOD_MAP[mood.toLowerCase()];
    if (!mapped) {
      throw new AppError(
        'Tipo de ánimo inválido (excellent, good, neutral, bad)',
        400,
        'INVALID_MOOD'
      );
    }

    return mapped;
  }

  async createOrUpdateLog(
    patientId: string,
    data: CreateMoodLogDto
  ): Promise<MoodLog> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logDate = data.logDate ? new Date(data.logDate) : today;
    logDate.setHours(0, 0, 0, 0);

    if (logDate > today) {
      throw new AppError(
        'No se puede registrar ánimo a futuro',
        400,
        'FUTURE_LOG_DATE'
      );
    }

    const moodType = this.mapMoodStringToInt(data.moodType);

    const existing = await this.moodLogRepo.findByPatientDate(
      patientId,
      logDate
    );

    if (existing) {
      existing.moodType = moodType;
      existing.patientComment = data.patientComment;
      return this.moodLogRepo.save(existing);
    }

    const log = new MoodLog();
    log.patientId = patientId;
    log.logDate = logDate;
    log.moodType = moodType;
    log.patientComment = data.patientComment;

    return this.moodLogRepo.save(log);
  }

  async getLogs(
    patientId: string,
    startDate?: string,
    endDate?: string
  ): Promise<MoodLog[]> {
    return this.moodLogRepo.findByPatient(
      patientId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }

  async addNutritionistComment(
    logId: string,
    comment: string
  ): Promise<MoodLog> {
    const log = await this.moodLogRepo.findById(logId);
    if (!log) {
      throw new AppError(
        'Registro de ánimo no encontrado',
        404,
        'MOOD_LOG_NOT_FOUND'
      );
    }

    log.nutritionistComment = comment;
    return this.moodLogRepo.save(log);
  }
}