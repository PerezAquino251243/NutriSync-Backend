import { Request, Response, NextFunction } from 'express';
import { RecipeService } from '../../application/nutrition/services/recipe_service';
import { CreateRecipeSchema } from '../../application/nutrition/dtos/create_recipe_dto';

export class RecipeController {
  private recipeService: RecipeService;

  constructor() {
    this.recipeService = new RecipeService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nutritionistId = req.user!.id;
      const validatedData = CreateRecipeSchema.parse(req.body);
      const recipe = await this.recipeService.create(
        nutritionistId,
        validatedData
      );

      res.status(201).json({
        success: true,
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nutritionistId = req.user!.id;
      const recipes = await this.recipeService.listByNutritionist(
        nutritionistId
      );

      res.status(200).json({
        success: true,
        data: recipes,
      });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const recipe = await this.recipeService.getById(id);

      res.status(200).json({
        success: true,
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  };
}