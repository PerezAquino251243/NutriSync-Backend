export const ML_PER_GLASS = 250;

export const WaterGlasses = {
  fromMl(ml: number): number {
    return Math.round(ml / ML_PER_GLASS);
  },

  isValidGlasses(glasses: number): boolean {
    return Number.isInteger(glasses) && glasses >= 0;
  },
};