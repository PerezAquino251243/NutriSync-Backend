export class DietPlan {
  id!: string;
  name!: string;
  targetCalories!: number;
  nutritionistId!: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;
}