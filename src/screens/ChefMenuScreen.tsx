import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useStore } from '../context/StoreContext';
import { COLORS } from '../utils/colors';
import DishCard from '../components/DishCard';

const ChefMenuScreen: React.FC<any> = ({ navigation }) => {
  const { dishes, removeDish } = useStore();
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);

  const toggleSelection = (dishId: string) => {
    setSelectedDishes(prev =>
      prev.includes(dishId)
        ? prev.filter(id => id !== dishId)
        : [...prev, dishId]
    );
  };

  const confirmRemoveSelected = () => {
    if (selectedDishes.length === 0) {
      Alert.alert('No Selection', 'Please select dishes to remove.');
      return;
    }

    Alert.alert(
      'Confirm Removal',
      `Remove ${selectedDishes.length} selected dish(es)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            for (const dishId of selectedDishes) {
              await removeDish(dishId);
            }
            setSelectedDishes([]);
            Alert.alert('Success', 'Selected dishes removed.');
          }
        }
      ]
    );
  };

  const renderDish = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => toggleSelection(item.id)}
      style={[
        styles.dishItem,
        selectedDishes.includes(item.id) && styles.selectedDish
      ]}
    >
      <DishCard
        dish={item}
        onPress={() => toggleSelection(item.id)}
        onAction={(dish) => navigation.navigate('AddEdit', { isEdit: true, dishId: dish.id })}
      />
      {selectedDishes.includes(item.id) && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chef Menu Management</Text>
        <Text style={styles.headerSubtitle}>Add and remove dishes</Text>
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddEdit', { isEdit: false })}
        >
          <Text style={styles.addBtnText}>+ Add Dish</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.removeBtn, selectedDishes.length === 0 && styles.disabledBtn]}
          onPress={confirmRemoveSelected}
          disabled={selectedDishes.length === 0}
        >
          <Text style={styles.removeBtnText}>
            Remove ({selectedDishes.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dishes}
        keyExtractor={(item) => item.id}
        renderItem={renderDish}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No dishes in the menu yet.</Text>
            <Text style={styles.emptySubtext}>Tap "Add Dish" to get started.</Text>
          </View>
        )}
      />

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
  actionBar: {
    flexDirection: 'row' as const,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  addBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center' as const,
  },
  addBtnText: {
    color: 'white',
    fontWeight: '600' as const,
    fontSize: 16,
  },
  removeBtn: {
    flex: 1,
    backgroundColor: COLORS.error,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center' as const,
  },
  removeBtnText: {
    color: 'white',
    fontWeight: '600' as const,
    fontSize: 16,
  },
  disabledBtn: {
    backgroundColor: COLORS.textLight,
  },
  listContainer: {
    padding: 16,
  },
  dishItem: {
    position: 'relative' as const,
    marginBottom: 12,
  },
  selectedDish: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
  },
  checkmark: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 1,
  },
  checkmarkText: {
    color: 'white',
    fontWeight: '700' as const,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  backBtn: {
    backgroundColor: COLORS.secondary,
    margin: 16,
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

export default ChefMenuScreen;
