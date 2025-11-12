export type Dish = {
  id: string;
  name: string;
  description: string;
  course: 'starter' | 'main' | 'dessert' | 'drink';
  price: number;
  image?: string;
  available?: boolean;
  createdAt?: number;
  updatedAt?: number;
};

export type Menu = {
  id: string;
  date: string;
  itemIds: string[];
};

export type StoreContextType = {
  dishes: Dish[];
  menus: Menu[];
  addDish: (d: Dish) => Promise<void>;
  updateDish: (d: Dish) => Promise<void>;
  removeDish: (id: string) => Promise<void>;
  publishMenu: (date: string, itemIds: string[]) => Promise<void>;
};
