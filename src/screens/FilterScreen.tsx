import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useStore } from '../context/StoreContext';
import { COLORS } from '../utils/colors';
import DishCard from '../components/DishCard';

const FilterScreen: React.FC<any> = ({ navigation }) => {
  const { dishes } = useStore();
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const courses = [
    { key: 'starter', label: 'Starters', color: COLORS.primary },
    { key: 'main', label: 'Mains', color: COLORS.secondaryDark },
    { key: 'dessert', label: 'Desserts', color: COLORS.warning },
    { key: 'drink', label: 'Drinks', color: COLORS.accent },
  ];

  const toggleCourse = (course: string) => {
    setSelectedCourses(prev =>
      prev.includes(course)
        ? prev.filter(c => c !== course)
        : [...prev, course]
    );
  };

  const filteredDishes = dishes.filter(dish =>
    selectedCourses.length === 0 || selectedCourses.includes(dish.course)
  );

  const getCourseColor = (course: string) => {
    const courseObj = courses.find(c => c.key === course);
    return courseObj?.color || COLORS.textLight;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filter Menu</Text>
        <Text style={styles.headerSubtitle}>Select courses to display</Text>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Course Selection</Text>
        <View style={styles.courseGrid}>
          {courses.map(course => (
            <TouchableOpacity
              key={course.key}
              style={[
                styles.courseChip,
                selectedCourses.includes(course.key) && styles.selectedChip,
                { borderColor: course.color }
              ]}
              onPress={() => toggleCourse(course.key)}
            >
              <Text
                style={[
                  styles.courseChipText,
                  selectedCourses.includes(course.key) && styles.selectedChipText,
                  { color: selectedCourses.includes(course.key) ? 'white' : course.color }
                ]}
              >
                {course.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => setSelectedCourses([])}
        >
          <Text style={styles.clearBtnText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>
          {filteredDishes.length} dish{filteredDishes.length !== 1 ? 'es' : ''} found
        </Text>

        <FlatList
          data={filteredDishes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DishCard
              dish={item}
              onPress={(dish) => navigation.navigate('DishDetail', { dishId: dish.id })}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {selectedCourses.length === 0
                  ? 'No dishes available'
                  : 'No dishes match your filters'
                }
              </Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backBtnText}>Back to Menu</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = {
  header: {
    padding: 16,
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
    marginTop: 4,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: COLORS.card,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 12,
  },
  courseGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  courseChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
  },
  courseChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  selectedChipText: {
    color: 'white',
  },
  clearBtn: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.textLight,
    borderRadius: 8,
    alignSelf: 'flex-start' as const,
  },
  clearBtnText: {
    color: 'white',
    fontWeight: '600' as const,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center' as const,
  },
  backBtn: {
    position: 'absolute' as const,
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center' as const,
  },
  backBtnText: {
    color: 'white',
    fontWeight: '600' as const,
    fontSize: 16,
  },
};

export default FilterScreen;
