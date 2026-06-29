export class MedicationTaken {
  id!: string;
  reminderId!: string;
  scheduledDatetime!: Date;
  taken!: boolean;
  takenAt?: Date;
  createdAt!: Date;
}