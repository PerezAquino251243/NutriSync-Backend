export class MealConsumption {
  id!: string;
  patientId!: string;
  mealId!: string;
  consumptionDate!: Date;
  consumed!: boolean;
  substitutedRecipeId?: string;
  notes?: string;
  createdAt!: Date;
  updatedAt!: Date;
}