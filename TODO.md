# TODO: Refactor Chef's Menu App and Add New Features

## Phase 1: Project Structure Setup
- [ ] Create src/ directory
- [ ] Create src/components/ directory
- [ ] Create src/screens/ directory
- [ ] Create src/context/ directory
- [ ] Create src/types/ directory
- [ ] Create src/utils/ directory

## Phase 2: Extract Types and Constants
- [ ] Create src/types/index.ts with Dish, Menu, StoreContextType
- [ ] Create src/utils/colors.ts with COLORS object
- [ ] Create src/utils/constants.ts with STORAGE_KEY, PLACEHOLDER_IMAGES, WELCOME_IMAGE

## Phase 3: Extract Context
- [ ] Create src/context/StoreContext.tsx with StoreProvider and useStore hook

## Phase 4: Extract Components
- [ ] Create src/components/DishCard.tsx
- [ ] Create src/components/ImagePickerHelper.tsx (if needed)
- [ ] Create src/components/CourseBadge.tsx (reusable component)

## Phase 5: Extract Screens
- [ ] Create src/screens/SplashScreen.tsx
- [ ] Create src/screens/HomeScreen.tsx (with tabs and average prices)
- [ ] Create src/screens/ChefMenuScreen.tsx (for adding/removing dishes)
- [ ] Create src/screens/FilterScreen.tsx (for guest filtering)
- [ ] Create src/screens/DishDetailScreen.tsx
- [ ] Create src/screens/AddEditScreen.tsx
- [ ] Create src/screens/SearchScreen.tsx
- [ ] Create src/screens/PublishScreen.tsx

## Phase 6: Update Main App.tsx
- [ ] Refactor App.tsx to import from new files
- [ ] Update navigation to include new screens
- [ ] Remove old code, keep only navigation setup

## Phase 7: Add New Features
- [ ] Implement average price calculation and display on HomeScreen
- [ ] Move add/edit functionality to ChefMenuScreen
- [ ] Add remove functionality in ChefMenuScreen
- [ ] Implement FilterScreen for course filtering
- [ ] Update HomeScreen to show complete menu without add button
- [ ] Ensure dishes are saved in array (already implemented)

## Phase 8: Testing and Cleanup
- [ ] Test all screens and features
- [ ] Update styles if needed
- [ ] Ensure no broken imports
- [ ] Run app to verify functionality
