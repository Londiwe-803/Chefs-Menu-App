# Christoffel Menu Management App  
**Author:** Londiwe Tembe  
**Coursework – Part 1: GUI Design & Implementation**  

---

## 1. Introduction  
The Christoffel Menu Management App is a mobile application designed to enable restaurant staff to add, edit, view, and publish menu items digitally. This system provides flexibility in updating menus without redesigning entire menu boards, thus reducing time, cost, and errors.  

The aim of Part 1 is to design the **Graphical User Interface (GUI)**, navigation flow, and implementation logic using **React Native**.

---

## 2. Purpose of the Application  
The app solves the problem of static printed menus by introducing a flexible and editable digital menu. Staff can:  
- Add new dishes with details (name, price, course, description)  
- Edit or delete existing dishes  
- View full menu in a structured layout  
- Publish/export the menu digitally  

---

## 3. Core Features  
| Feature | Description |
|---------|-------------|
| Add Dish | Users can input name, course, price, and description |
| Edit/Delete Dish | Modify or remove a previously added item |
| Menu List | Displays all dishes grouped by course (Starters, Mains, Desserts) |
| Search | Filter menu items by name or course |
| Publish Menu | Prepare menu for digital or printable output |
| Splash Screen | App logo and loading screen |
| Navigation Flow | Tab-based and stack-based screen transitions |

---

## 4. Technology Stack  
| Technology | Purpose |
|------------|---------|
| React Native | Cross-platform mobile UI framework |
| Expo | Simplifies React Native development & testing |
| TypeScript | Adds strong typing and structure |
| React Navigation | Handles screen transitions |
| Context API | Stores menu items globally across components |

---

## 5. Installation & Setup Instructions  

```bash
# 1. Install Expo CLI
npm install -g expo-cli

# 2. Create new project
expo init christoffel-menu-app
cd christoffel-menu-app

# 3. Install dependencies
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install

# 4. Generate App.tsx code into project

# 5. Run the app
expo start
6. Application Navigation Flow
Splash Screen
      ↓
Home Screen (Bottom Tab Navigator)
      ├── Menu List Screen
      │       ├── Add Dish Screen
      │       ├── Edit Dish Screen
      │       └── Dish Details Screen
      ├── Search / Filter Screen
      └── Publish Menu Screen
7. Wireframe Layout (Placeholders)
| Screen        | Wireframe Placeholder               |
| ------------- | ----------------------------------- |
| Splash Screen | ![Splash](images/splash_screen.png) |
| Menu List     | ![Menu List](images/menu_list.png)  |
| Add Dish      | ![Add Dish](images/add_dish.png)    |
| Edit Dish     | ![Edit Dish](images/edit_dish.png)  |
| Publish Menu  | ![Publish](images/publish_menu.png) |
8. React Native Implementation Logic (Summary)
✅ State Management

Uses React Context API to store dishes globally.

Dishes structured as:
type Dish = {
  id: string;
  name: string;
  course: 'Starter' | 'Main' | 'Dessert';
  price: number;
  description: string;
};
Add Dish Logic
const addDish = (newDish: Dish) => {
  setDishes([...dishes, newDish]);
};

✅ Edit and Delete Logic
const updateDish = (id, updatedDish) => {
  setDishes(dishes.map(dish => dish.id === id ? updatedDish : dish));
};

const deleteDish = (id) => {
  setDishes(dishes.filter(dish => dish.id !== id));
};

✅ Navigation Example
<Stack.Screen name="AddDish" component={AddDishScreen} />
<Stack.Screen name="DishDetails" component={DishDetailsScreen} />

9. Future Enhancements

✔ Add image upload for dishes
✔ Save data using AsyncStorage or Firebase
✔ User authentication for admin access
✔ Light/Dark theme support
✔ Export menu as downloadable PDF

10. Conclusion

This document presents the GUI design, navigation logic, and implementation approach for the Christoffel Menu Management App. The system focuses on accessibility, efficiency, and flexibility, enabling restaurant staff to maintain menus digitally with ease. This lays the groundwork for Part 2, where full functionality and database integration will be developed.

11. References (Harvard – Anglia Ruskin Style)

Google. (2025) Material Design Guidelines. Available at: https://m3.material.io/
 (Accessed: 9 September 2025).

Nielsen, J. (1994) Usability engineering. San Francisco: Morgan Kaufmann.

OpenAI. (2025) React Native: Cross-platform mobile development. Available at: https://reactnative.dev/
 (Accessed: 9 September 2025).

Sharp, H., Rogers, Y. and Preece, J. (2019) Interaction design: beyond human-computer interaction. 5th edn. Hoboken, NJ: Wiley.

End of README
Author: Londiwe Tembe 
