import React from 'react';
import { SafeAreaView, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useStore } from '../context/StoreContext';
import { COLORS } from '../utils/colors';
import { PLACEHOLDER_IMAGES } from '../utils/constants';

interface DishDetailScreenProps {
  navigation: any;
  route: any;
}

const DishDetailScreen: React.FC<DishDetailScreenProps> = ({ navigation, route }) => {
  const { dishId } = route.params;
  const { dishes } = useStore();
  const dish = dishes.find(d => d.id === dishId);

  if (!dish) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
        <Text style={{ color: COLORS.textLight }}>Dish not found</Text>
      </SafeAreaView>
    );
  }

  const getCourseColor = (course: string) => {
    switch (course) {
      case 'starter': return COLORS.primary;
      case 'main': return COLORS.secondaryDark;
      case 'dessert': return COLORS.warning;
      case 'drink': return COLORS.accent;
      default: return COLORS.textLight;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{ uri: dish.image || PLACEHOLDER_IMAGES[dish.course] }}
          style={styles.heroImage}
          defaultSource={{ uri: PLACEHOLDER_IMAGES[dish.course] }}
        />

        <View style={styles.content}>
          <View style={[styles.courseBadge, { backgroundColor: getCourseColor(dish.course) }]}>
            <Text style={styles.courseBadgeText}>{dish.course.toUpperCase()}</Text>
          </View>

          <Text style={styles.title}>{dish.name}</Text>
          <Text style={styles.price}>R{dish.price}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{dish.description}</Text>

          <View style={styles.divider} />

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Course</Text>
              <Text style={styles.metaValue}>{dish.course}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Price</Text>
              <Text style={styles.metaValue}>R{dish.price}</Text>
            </View>
            {dish.createdAt && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Added</Text>
                <Text style={styles.metaValue}>
                  {new Date(dish.createdAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('AddEdit', { isEdit: true, dishId: dish.id })}
        >
          <Text style={styles.editBtnText}>Edit Dish</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flexGrow: 1,
  },
  heroImage: {
    width: '100%' as const,
    height: 250,
  },
  content: {
    padding: 20,
  },
  courseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start' as const,
    marginBottom: 16,
  },
  courseBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: COLORS.text,
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.primary,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  metaContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    flexWrap: 'wrap' as const,
  },
  metaItem: {
    alignItems: 'center' as const,
    minWidth: 80,
  },
  metaLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  footer: {
    flexDirection: 'row' as const,
    padding: 16,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  editBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center' as const,
  },
  editBtnText: {
    color: 'white',
    fontWeight: '600' as const,
    fontSize: 16,
  },
  backBtn: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center' as const,
  },
  backBtnText: {
    color: 'white',
    fontWeight: '600' as const,
    fontSize: 16,
  },
};

export default DishDetailScreen;
