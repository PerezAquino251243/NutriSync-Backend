export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export class Meal {
  id!: string;
  dietPlanId!: string;
  dayNumber!: number;
  mealType!: MealType;
  scheduledTime!: string;
  createdAt!: Date;
  updatedAt!: Date;
}