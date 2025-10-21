// App.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Platform,
  KeyboardAvoidingView
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { Formik } from 'formik';
import * as Yup from 'yup';

//
// -------------------- Types --------------------
//
type Dish = {
  id: string;
  name: string;
  description: string;
  course: 'starter' | 'main' | 'dessert' | 'drink';
  price: number;
  available?: boolean;
  createdAt?: number;
  updatedAt?: number;
};

type Menu = {
  id: string;
  date: string; // YYYY-MM-DD
  itemIds: string[];
};

type StoreContextType = {
  dishes: Dish[];
  menus: Menu[];
  addDish: (d: Dish) => Promise<void>;
  updateDish: (d: Dish) => Promise<void>;
  removeDish: (id: string) => Promise<void>;
  publishMenu: (date: string, itemIds: string[]) => Promise<void>;
};

//
// -------------------- Storage key --------------------
const STORAGE_KEY = '@christoffel_v1';

//
// -------------------- Context + Provider --------------------
const StoreContext = createContext<StoreContextType | undefined>(undefined);

const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
          // seed sample data
          const sample: Dish[] = [
            { id: '1', name: 'Tomato Bruschetta', description: 'Toasted bread with tomato and basil', course: 'starter', price: 65, available: true, createdAt: Date.now() },
            { id: '2', name: 'Steak au Poivre', description: 'Pepper-crusted sirloin with cognac sauce', course: 'main', price: 220, available: true, createdAt: Date.now() },
            { id: '3', name: 'Crème Brûlée', description: 'Classic vanilla custard with caramelised top', course: 'dessert', price: 85, available: true, createdAt: Date.now() }
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StoreContext.Provider value={{ dishes, menus, addDish, updateDish, removeDish, publishMenu }}>
      {children}
    </StoreContext.Provider>
  );
};

//
// -------------------- Navigation --------------------
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

//
// -------------------- Small reusable components --------------------
const DishCard: React.FC<{ dish: Dish; onPress?: (d: Dish) => void; onAction?: (d: Dish) => void }> = ({ dish, onPress, onAction }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress && onPress(dish)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{dish.name}</Text>
        <Text style={styles.cardMeta}>{dish.course.toUpperCase()} • R{dish.price}</Text>
        <Text numberOfLines={2} style={styles.cardDesc}>{dish.description}</Text>
      </View>
      {onAction ? (
        <TouchableOpacity style={styles.cardAction} onPress={() => onAction(dish)}>
          <Text style={{ color: 'white', fontWeight: '700' }}>⋯</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

//
// -------------------- Screens --------------------
//

/* SplashScreen */
const SplashScreen: React.FC<any> = ({ navigation }) => {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Home'), 1400);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.centered}>
      <Text style={styles.logo}>Christoffel</Text>
      <Text style={styles.subtitle}>Private Chef — Menu Manager</Text>
      <TouchableOpacity style={styles.enterBtn} onPress={() => navigation.replace('Home')}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Enter</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

/* MenuList Screen used by tabs */
const MenuListScreen: React.FC<{ route?: any; navigation?: any; filter?: string }> = ({ navigation, route, filter = 'all' }) => {
  const { dishes } = useStore();
  const filtered = dishes.filter((d) => (filter === 'all' ? true : d.course === filter));

  return (
    <SafeAreaView style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            onPress={(dish) => navigation.navigate('DishDetail', { dishId: dish.id })}
            onAction={(dish) => navigation.navigate('AddEdit', { isEdit: true, dishId: dish.id })}
          />
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text>No dishes yet — add one!</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fabAdd} onPress={() => navigation.navigate('AddEdit', { isEdit: false })}>
        <Text style={{ color: 'white', fontWeight: '700' }}>+ Add</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.publishBtnMini} onPress={() => navigation.navigate('Publish')}>
        <Text style={{ color: 'white' }}>Publish Tonight</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

/* Home tabs (All, Starters, Mains, Desserts, Drinks) */
const HomeTabs: React.FC<any> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 8 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.searchBtn}>
          <Text style={{ color: 'white' }}>Search</Text>
        </TouchableOpacity>
      </View>
      <Tab.Navigator initialRouteName="All">
        <Tab.Screen name="All">{(props) => <MenuListScreen {...props} filter="all" />}</Tab.Screen>
        <Tab.Screen name="Starters">{(props) => <MenuListScreen {...props} filter="starter" />}</Tab.Screen>
        <Tab.Screen name="Mains">{(props) => <MenuListScreen {...props} filter="main" />}</Tab.Screen>
        <Tab.Screen name="Desserts">{(props) => <MenuListScreen {...props} filter="dessert" />}</Tab.Screen>
        <Tab.Screen name="Drinks">{(props) => <MenuListScreen {...props} filter="drink" />}</Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
};

/* Dish Detail */
const DishDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { dishId } = route.params;
  const { dishes, removeDish } = useStore();

  const dish = dishes.find((d) => d.id === dishId);
  if (!dish) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Dish not found</Text>
      </SafeAreaView>
    );
  }

  const confirmDelete = () => {
    Alert.alert('Confirm delete', 'Are you sure you want to delete this dish?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeDish(dish.id);
          navigation.goBack();
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={styles.detailTitle}>{dish.name}</Text>
      <Text style={styles.cardMeta}>{dish.course} • R{dish.price}</Text>
      <Text style={{ marginTop: 12 }}>{dish.description}</Text>

      <View style={{ flexDirection: 'row', marginTop: 24 }}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('AddEdit', { isEdit: true, dishId: dish.id })}>
          <Text style={{ color: 'white' }}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#e53935', marginLeft: 12 }]} onPress={confirmDelete}>
          <Text style={{ color: 'white' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/* Add / Edit Dish (Formik + Yup) */
const DishSchema = Yup.object().shape({
  name: Yup.string().required('Required').min(2, 'Too short').max(60, 'Too long'),
  description: Yup.string().required('Required').min(10, 'Too short'),
  course: Yup.string().required('Required').oneOf(['starter', 'main', 'dessert', 'drink']),
  price: Yup.number().required('Required').min(0, 'Must be >= 0')
});

const AddEditScreen: React.FC<any> = ({ route, navigation }) => {
  const { isEdit = false, dishId } = route.params || {};
  const { dishes, addDish, updateDish } = useStore();

  const editing = isEdit ? dishes.find((d) => d.id === dishId) : undefined;

  const initial = {
    name: editing?.name || '',
    description: editing?.description || '',
    course: (editing?.course as string) || '',
    price: editing?.price?.toString() || ''
  };

  const onSubmit = async (values: any) => {
    try {
      if (isEdit && editing) {
        const upd: Dish = {
          ...editing,
          name: values.name,
          description: values.description,
          course: values.course,
          price: parseFloat(values.price),
          updatedAt: Date.now()
        };
        await updateDish(upd);
        navigation.goBack();
      } else {
        const newDish: Dish = {
          id: `${Date.now()}`,
          name: values.name,
          description: values.description,
          course: values.course,
          price: parseFloat(values.price),
          available: true,
          createdAt: Date.now()
        };
        await addDish(newDish);
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert('Save failed', String(e));
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Formik initialValues={initial} validationSchema={DishSchema} onSubmit={onSubmit} enableReinitialize>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <Text style={styles.label}>Dish Name</Text>
              <TextInput style={styles.input} placeholder="e.g., Steak au Poivre" onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={values.name} />
              {touched.name && errors.name && <Text style={styles.err}>{String(errors.name)}</Text>}

              <Text style={styles.label}>Description</Text>
              <TextInput style={[styles.input, { height: 100 }]} multiline placeholder="Short description" onChangeText={handleChange('description')} onBlur={handleBlur('description')} value={values.description} />
              {touched.description && errors.description && <Text style={styles.err}>{String(errors.description)}</Text>}

              <Text style={styles.label}>Course</Text>
              <TextInput style={styles.input} placeholder="starter | main | dessert | drink" onChangeText={handleChange('course')} onBlur={handleBlur('course')} value={values.course} />
              {touched.course && errors.course && <Text style={styles.err}>{String(errors.course)}</Text>}

              <Text style={styles.label}>Price (R)</Text>
              <TextInput style={styles.input} keyboardType="numeric" placeholder="0.00" onChangeText={handleChange('price')} onBlur={handleBlur('price')} value={values.price} />
              {touched.price && errors.price && <Text style={styles.err}>{String(errors.price)}</Text>}

              <TouchableOpacity style={styles.primaryBtn} onPress={() => handleSubmit()}>
                <Text style={{ color: 'white', fontWeight: '700' }}>{isEdit ? 'Save Changes' : 'Save Dish'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ marginTop: 10, alignItems: 'center' }} onPress={() => navigation.goBack()}>
                <Text style={{ color: '#0a66ff' }}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

/* Search / Filter */
const SearchScreen: React.FC<any> = ({ navigation }) => {
  const { dishes } = useStore();
  const [query, setQuery] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [course, setCourse] = useState('');

  const results = dishes.filter((d) => {
    if (course && d.course !== course) return false;
    if (min && d.price < parseFloat(min)) return false;
    if (max && d.price > parseFloat(max)) return false;
    if (query && !d.name.toLowerCase().includes(query.toLowerCase()) && !d.description.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <SafeAreaView style={{ flex: 1, padding: 12 }}>
      <TextInput placeholder="Search by name or description" style={styles.input} value={query} onChangeText={setQuery} />
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <TextInput placeholder="Min" style={[styles.input, { flex: 1, marginRight: 6 }]} keyboardType="numeric" value={min} onChangeText={setMin} />
        <TextInput placeholder="Max" style={[styles.input, { flex: 1 }]} keyboardType="numeric" value={max} onChangeText={setMax} />
      </View>
      <TextInput placeholder="Course (starter/main/dessert/drink)" style={[styles.input, { marginTop: 8 }]} value={course} onChangeText={setCourse} />

      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <DishCard dish={item} onPress={(d) => navigation.navigate('DishDetail', { dishId: d.id })} />}
        ListEmptyComponent={() => <Text style={{ marginTop: 20 }}>No results</Text>}
      />
    </SafeAreaView>
  );
};

/* Publish Menu */
const PublishScreen: React.FC<any> = ({ navigation }) => {
  const { dishes, publishMenu } = useStore();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handlePublish = async () => {
    if (selected.length === 0) {
      Alert.alert('Select at least one dish to publish');
      return;
    }
    const date = new Date().toISOString().split('T')[0];
    await publishMenu(date, selected);
    Alert.alert('Published', `Menu for ${date} published`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 12 }}>
      <Text style={{ marginBottom: 12 }}>Select dishes to include in tonight's menu:</Text>
      <FlatList
        data={dishes}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggle(item.id)} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
            <View style={{ width: 22, height: 22, borderWidth: 1, marginRight: 12, backgroundColor: selected.includes(item.id) ? '#00a859' : 'white' }} />
            <Text>{item.name} — R{item.price}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#00a859', marginTop: 12 }]} onPress={handlePublish}>
        <Text style={{ color: 'white' }}>Publish</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

//
// -------------------- Root App --------------------
export default function App() {
  return (
    <StoreProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeTabs} options={{ title: 'Christoffel Menu' }} />
          <Stack.Screen name="DishDetail" component={DishDetailScreen} options={{ title: 'Dish Detail' }} />
          <Stack.Screen name="AddEdit" component={AddEditScreen} options={({ route }: any) => ({ title: route?.params?.isEdit ? 'Edit Dish' : 'Add Dish' })} />
          <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search & Filter' }} />
          <Stack.Screen name="Publish" component={PublishScreen} options={{ title: 'Publish Menu' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
}

//
// -------------------- Styles --------------------
const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  logo: { fontSize: 36, fontWeight: '800' },
  subtitle: { marginTop: 8, color: '#666' },
  enterBtn: { marginTop: 20, backgroundColor: '#0a66ff', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 8 },

  card: { flexDirection: 'row', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', marginBottom: 10, alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardMeta: { fontSize: 12, color: '#666', marginTop: 4 },
  cardDesc: { fontSize: 12, color: '#333', marginTop: 6 },
  cardAction: { backgroundColor: '#0a66ff', padding: 10, borderRadius: 6, marginLeft: 10 },

  fabAdd: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#0a66ff', padding: 14, borderRadius: 28 },
  publishBtnMini: { position: 'absolute', left: 16, bottom: 16, backgroundColor: '#00a859', padding: 12, borderRadius: 8 },

  detailTitle: { fontSize: 20, fontWeight: '800' },

  label: { fontWeight: '600', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6, marginTop: 6 },
  err: { color: '#e53935', marginTop: 6 },

  primaryBtn: { backgroundColor: '#0a66ff', padding: 14, borderRadius: 8, alignItems: 'center' },
  searchBtn: { backgroundColor: '#0a66ff', padding: 8, borderRadius: 6 },

  cardMetaSmall: { color: '#666' },
});
