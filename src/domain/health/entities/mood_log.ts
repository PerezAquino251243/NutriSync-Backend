export class MoodLog {
  id!: string;
  patientId!: string;
  logDate!: Date;
  moodType!: number;
  patientComment?: string;
  nutritionistComment?: string;
  createdAt!: Date;
  updatedAt!: Date;
}