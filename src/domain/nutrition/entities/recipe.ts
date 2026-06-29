export type RecipeSource = 'internal' | 'external';

export class Recipe {
  id!: string;
  name!: string;
  description!: string;
  preparationMethod!: string;
  observations?: string;
  nutritionInfo!: Record<string, unknown>;
  ingredients!: unknown[];
  createdByNutritionistId!: string;
  externalId?: string;
  source!: RecipeSource;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;
}