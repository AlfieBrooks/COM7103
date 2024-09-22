// export interface CustomRecipe extends Recipe {
//   image?: string;
// }

export interface Recipe {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt?: Date;
  ingredients: string[];
  instructions: string;
  isPending?: boolean;
}