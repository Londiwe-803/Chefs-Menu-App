import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dish, Menu, StoreContextType } from '../types';
import { COLORS } from '../utils/colors';
import { STORAGE_KEY, PLACEHOLDER_IMAGES } from '../utils/constants';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setDishes(parsed.dishes || []);
          setMenus(parsed.menus || []);
        } else {
          // Enhanced sample data with more items
          const sample: Dish[] = [
            // Starters
            {
              id: '1',
              name: 'Tomato Bruschetta',
              description: 'Toasted artisan bread with fresh tomatoes, basil, and extra virgin olive oil',
              course: 'starter',
              price: 65,
              image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            },
            {
              id: '2',
              name: 'Beef Carpaccio',
              description: 'Thinly sliced prime beef with arugula, parmesan, and truffle oil',
              course: 'starter',
              price: 95,
              image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            },
            {
              id: '3',
              name: 'Seared Scallops',
              description: 'Perfectly seared scallops with cauliflower purée and crispy pancetta',
              course: 'starter',
              price: 120,
              image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            },

            // Mains
            {
              id: '4',
              name: 'Steak au Poivre',
              description: 'Pepper-crusted sirloin with cognac cream sauce and seasonal vegetables',
              course: 'main',
              price: 220,
              image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            },
            {
              id: '5',
              name: 'Herb Crusted Lamb',
              description: 'Rack of lamb with rosemary crust, mint jus, and roasted potatoes',
              course: 'main',
              price: 245,
              image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            },
            {
              id: '6',
              name: 'Pan-Seared Salmon',
              description: 'Atlantic salmon with lemon butter sauce and asparagus',
              course: 'main',
              price: 185,
              image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            },
            {
              id: '7',
              name: 'Wild Mushroom Risotto',
              description: 'Arborio rice with seasonal wild mushrooms and parmesan',
              course: 'main',
              price: 145,
              image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            },

            // Desserts
            {
              id: '8',
              name: 'Crème Brûlée',
              description: 'Classic vanilla custard with caramelised sugar top and fresh berries',
              course: 'dessert',
              price: 85,
              image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            },
            {
              id: '9',
              name: 'Chocolate Lava Cake',
              description: 'Warm chocolate cake with molten center and vanilla ice cream',
              course: 'dessert',
              price: 75,
              image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            },
            {
              id: '10',
              name: 'Tiramisu',
              description: 'Traditional Italian dessert with mascarpone and espresso',
              course: 'dessert',
              price: 70,
              image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            },

            // Drinks
            {
              id: '11',
              name: 'South African Chenin Blanc',
              description: 'Crisp white wine with notes of citrus and tropical fruits',
              course: 'drink',
              price: 180,
              image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            },
            {
              id: '12',
              name: 'Craft Gin & Tonic',
              description: 'Premium local gin with fever-tree tonic and botanicals',
              course: 'drink',
              price: 95,
              image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            },
            {
              id: '13',
              name: 'Espresso Martini',
              description: 'Vodka, fresh espresso, and coffee liqueur',
              course: 'drink',
              price: 110,
              image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            },
            {
              id: '14',
              name: 'Fresh Orange Juice',
              description: 'Freshly squeezed orange juice, served chilled',
              course: 'drink',
              price: 45,
              image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
              available: true,
              createdAt: Date.now()
            }
          ];
          setDishes(sample);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ dishes: sample, menus: [] }));
        }
      } catch (e) {
        console.warn('Failed to load storage', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (dishesToSave = dishes, menusToSave = menus) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ dishes: dishesToSave, menus: menusToSave }));
    } catch (e) {
      console.warn('Persist failed', e);
    }
  };

  const addDish = async (d: Dish) => {
    const next = [d, ...dishes];
    setDishes(next);
    await persist(next, menus);
  };

  const updateDish = async (d: Dish) => {
    const next = dishes.map((x) => (x.id === d.id ? { ...x, ...d, updatedAt: Date.now() } : x));
    setDishes(next);
    await persist(next, menus);
  };

  const removeDish = async (id: string) => {
    const next = dishes.filter((x) => x.id !== id);
    setDishes(next);
    await persist(next, menus);
  };

  const publishMenu = async (date: string, itemIds: string[]) => {
    const newMenu: Menu = { id: `${Date.now()}`, date, itemIds };
    const nextMenus = [newMenu, ...menus];
    setMenus(nextMenus);
    await persist(dishes, nextMenus);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 16, color: COLORS.text }}>Loading Christoffel Menu...</Text>
      </View>
    );
  }

  return (
    <StoreContext.Provider value={{ dishes, menus, addDish, updateDish, removeDish, publishMenu }}>
      {children}
    </StoreContext.Provider>
  );
};
