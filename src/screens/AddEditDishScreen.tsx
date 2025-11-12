import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useStore } from '../context/StoreContext';
import { Dish } from '../types';
import { COLORS } from '../utils/colors';
import { pickImage } from '../utils/imagePicker';

interface AddEditDishScreenProps {
  navigation: any;
  route: any;
}

const AddEditDishScreen: React.FC<AddEditDishScreenProps> = ({ navigation, route }) => {
  const { isEdit, dishId } = route.params || {};
  const { dishes, addDish, updateDish } = useStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<'starter' | 'main' | 'dessert' | 'drink'>('starter');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (isEdit && dishId) {
      const dish = dishes.find(d => d.id === dishId);
      if (dish) {
        setName(dish.name);
        setDescription(dish.description);
        setCourse(dish.course);
        setPrice(dish.price.toString());
        setImage(dish.image || '');
      }
    }
  }, [isEdit, dishId, dishes]);

  const handleImagePick = async () => {
    const uri = await pickImage();
    if (uri) setImage(uri);
  };

  const handleSave = async () => {
    if (!name.trim() || !description.trim() || !price.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    const dishData: Dish = {
      id: isEdit ? dishId : `${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      course,
      price: priceNum,
      image: image || undefined,
      available: true,
      createdAt: isEdit ? undefined : Date.now(),
      updatedAt: isEdit ? Date.now() : undefined,
    };

    try {
      if (isEdit) {
        await updateDish(dishData);
        Alert.alert('Success', 'Dish updated successfully');
      } else {
        await addDish(dishData);
        Alert.alert('Success', 'Dish added successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save dish');
    }
  };

  const courseOptions = [
    { key: 'starter', label: 'Starter', color: COLORS.primary },
    { key: 'main', label: 'Main Course', color: COLORS.secondaryDark },
    { key: 'dessert', label: 'Dessert', color: COLORS.warning },
    { key: 'drink', label: 'Drink', color: COLORS.accent },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{isEdit ? 'Edit Dish' : 'Add New Dish'}</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dish Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter dish name"
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter dish description"
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course *</Text>
            <View style={styles.courseOptions}>
              {courseOptions.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.courseOption,
                    course === option.key && { backgroundColor: option.color },
                    { borderColor: option.color }
                  ]}
                  onPress={() => setCourse(option.key as any)}
                >
                  <Text
                    style={[
                      styles.courseOptionText,
                      course === option.key && { color: 'white' },
                      { color: course === option.key ? 'white' : option.color }
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (R) *</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image URL (optional)</Text>
            <TextInput
              style={styles.input}
              value={image}
              onChangeText={setImage}
              placeholder="Enter image URL or pick from gallery"
              placeholderTextColor={COLORS.textLight}
            />
            <TouchableOpacity style={styles.imageBtn} onPress={handleImagePick}>
              <Text style={styles.imageBtnText}>Pick from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{isEdit ? 'Update' : 'Add'} Dish</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.text,
    marginBottom: 24,
    textAlign: 'center' as const,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top' as const,
  },
  courseOptions: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  courseOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  courseOptionText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  imageBtn: {
    marginTop: 8,
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start' as const,
  },
  imageBtnText: {
    color: 'white',
    fontWeight: '600' as const,
  },
  actions: {
    flexDirection: 'row' as const,
    gap: 16,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.textLight,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center' as const,
  },
  cancelBtnText: {
    color: 'white',
    fontWeight: '600' as const,
    fontSize: 16,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center' as const,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: '600' as const,
    fontSize: 16,
  },
};

export default AddEditDishScreen;
