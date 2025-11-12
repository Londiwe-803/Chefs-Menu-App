import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Dish } from '../types';
import { COLORS } from '../utils/colors';
import { PLACEHOLDER_IMAGES } from '../utils/constants';

interface DishCardProps {
  dish: Dish;
  onPress?: (dish: Dish) => void;
  onAction?: (dish: Dish) => void;
}

const DishCard: React.FC<DishCardProps> = ({ dish, onPress, onAction }) => {
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
    <TouchableOpacity style={styles.card} onPress={() => onPress && onPress(dish)}>
      <Image
        source={{ uri: dish.image || PLACEHOLDER_IMAGES[dish.course] }}
        style={styles.cardImage}
        defaultSource={{ uri: PLACEHOLDER_IMAGES[dish.course] }}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={[styles.courseBadge, { backgroundColor: getCourseColor(dish.course) }]}>
          <Text style={styles.courseBadgeText}>{dish.course.toUpperCase()}</Text>
        </View>
        <Text style={styles.cardTitle}>{dish.name}</Text>
        <Text style={styles.cardPrice}>R{dish.price}</Text>
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

const styles = {
  card: {
    flexDirection: 'row' as const,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  courseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start' as const,
    marginBottom: 8,
  },
  courseBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700' as const,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.primary,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  cardAction: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 6,
    marginLeft: 10,
    width: 36,
    height: 36,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};

export default DishCard;
