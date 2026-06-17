import { createContext } from 'react';
import { type RecipeContextType } from '../types/Types';

export const RecipeContext = createContext<RecipeContextType | undefined>(undefined);
