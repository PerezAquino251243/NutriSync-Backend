export class Reminder {
  id!: string;
  medicationId!: string;
  intervalHours?: number;
  daysOfWeek!: number[];
  startTime!: string;
  active!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}