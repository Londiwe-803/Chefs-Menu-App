import React from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useStore } from '../context/StoreContext';
import { COLORS } from '../utils/colors';
import DishCard from '../components/DishCard';

const Tab = createMaterialTopTabNavigator();

interface MenuListScreenProps {
  navigation: any;
  route?: any;
  filter?: string;
}

const MenuListScreen: React.FC<MenuListScreenProps> = ({ navigation, route, filter = 'all' }) => {
  const { dishes } = useStore();
  const filtered = dishes.filter((d) => (filter === 'all' ? true : d.course === filter));

  // Calculate average prices by course
  const calculateAveragePrices = () => {
    const courses = ['starter', 'main', 'dessert', 'drink'];
    const averages: { [key: string]: number } = {};

    courses.forEach(course => {
      const courseDishes = dishes.filter(d => d.course === course);
      if (courseDishes.length > 0) {
        const total = courseDishes.reduce((sum, d) => sum + d.price, 0);
        averages[course] = Math.round(total / courseDishes.length);
      } else {
        averages[course] = 0;
      }
    });

    return averages;
  };

  const averages = calculateAveragePrices();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1, padding: 12 }}>
        {/* Average Prices Display */}
        <View style={styles.averagesContainer}>
          <Text style={styles.averagesTitle}>Average Prices by Course</Text>
          <View style={styles.averagesGrid}>
            <View style={styles.averageItem}>
              <Text style={styles.averageLabel}>Starters</Text>
              <Text style={styles.averagePrice}>R{averages.starter}</Text>
            </View>
            <View style={styles.averageItem}>
              <Text style={styles.averageLabel}>Mains</Text>
              <Text style={styles.averagePrice}>R{averages.main}</Text>
            </View>
            <View style={styles.averageItem}>
              <Text style={styles.averageLabel}>Desserts</Text>
              <Text style={styles.averagePrice}>R{averages.dessert}</Text>
            </View>
            <View style={styles.averageItem}>
              <Text style={styles.averageLabel}>Drinks</Text>
              <Text style={styles.averagePrice}>R{averages.drink}</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DishCard
              dish={item}
              onPress={(dish) => navigation.navigate('DishDetail', { dishId: dish.id })}
            />
          )}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', marginTop: 40, padding: 20 }}>
              <Text style={{ color: COLORS.textLight, fontSize: 16 }}>No dishes yet — add one!</Text>
            </View>
          )}
        />

        <TouchableOpacity style={styles.filterBtn} onPress={() => navigation.navigate('Filter')}>
          <Text style={{ color: 'white', fontWeight: '600' }}>Filter by Course</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const HomeScreen: React.FC<any> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Christoffel Menu</Text>
          <Text style={styles.headerSubtitle}>Private Chef Collection</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ChefMenu')} style={styles.chefBtn}>
          <Text style={{ color: 'white', fontWeight: '600' }}>Chef Menu</Text>
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        initialRouteName="All"
        screenOptions={{
          tabBarActiveTintColor: COLORS.tabActive,
          tabBarInactiveTintColor: COLORS.tabInactive,
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
          tabBarStyle: { backgroundColor: COLORS.card },
          tabBarLabelStyle: { fontWeight: '600', textTransform: 'none' }
        }}
      >
        <Tab.Screen name="All">{(props) => <MenuListScreen {...props} filter="all" />}</Tab.Screen>
        <Tab.Screen name="Starters">{(props) => <MenuListScreen {...props} filter="starter" />}</Tab.Screen>
        <Tab.Screen name="Mains">{(props) => <MenuListScreen {...props} filter="main" />}</Tab.Screen>
        <Tab.Screen name="Desserts">{(props) => <MenuListScreen {...props} filter="dessert" />}</Tab.Screen>
        <Tab.Screen name="Drinks">{(props) => <MenuListScreen {...props} filter="drink" />}</Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  chefBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  averagesContainer: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  averagesTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  averagesGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  averageItem: {
    alignItems: 'center' as const,
    flex: 1,
  },
  averageLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  averagePrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.primary,
  },
  filterBtn: {
    position: 'absolute' as const,
    right: 20,
    bottom: 20,
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
};

export default HomeScreen;
