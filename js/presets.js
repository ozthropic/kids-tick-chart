// Preset routine data. Pure data — no logic, no storage access.
// Item ids are stable forever (localStorage references them); never rename.

export const ROUTINE_ORDER = ['morning', 'mealtime', 'tidy', 'bedtime'];

export const ROUTINES = {
  morning: {
    title: 'Morning',
    accent: 'sun',
    pickerIcon: 'wake-up',
    items: [
      { id: 'wake-up', label: 'Wake Up', icon: 'wake-up' },
      { id: 'potty', label: 'Potty', icon: 'potty' },
      { id: 'wash-face', label: 'Wash Face', icon: 'wash-face' },
      { id: 'brush-teeth', label: 'Brush Teeth', icon: 'brush-teeth' },
      { id: 'get-dressed', label: 'Get Dressed', icon: 'get-dressed' },
      { id: 'brush-hair', label: 'Brush Hair', icon: 'hairbrush' },
      { id: 'breakfast', label: 'Breakfast', icon: 'breakfast' }
    ]
  },
  mealtime: {
    title: 'Mealtime',
    accent: 'mint',
    pickerIcon: 'eat-food',
    items: [
      { id: 'wash-hands', label: 'Wash Hands', icon: 'wash-hands' },
      { id: 'sit-table', label: 'Sit at Table', icon: 'sit-table' },
      { id: 'eat-food', label: 'Eat Food', icon: 'eat-food' },
      { id: 'drink-water', label: 'Drink Water', icon: 'drink-water' },
      { id: 'clean-up', label: 'Clean Up', icon: 'clean-up' }
    ]
  },
  tidy: {
    title: 'Tidy Up',
    accent: 'berry',
    pickerIcon: 'pick-up-toys',
    items: [
      { id: 'pick-up-toys', label: 'Pick Up Toys', icon: 'pick-up-toys' },
      { id: 'books-shelf', label: 'Books on Shelf', icon: 'books-shelf' },
      { id: 'clothes-basket', label: 'Clothes in Basket', icon: 'clothes-basket' }
    ]
  },
  bedtime: {
    title: 'Bedtime',
    accent: 'night',
    pickerIcon: 'sleep',
    items: [
      { id: 'bath', label: 'Bath', icon: 'bath' },
      { id: 'pyjamas', label: 'Pyjamas', icon: 'pyjamas' },
      { id: 'brush-teeth', label: 'Floss & Brush Teeth', icon: 'brush-teeth' },
      { id: 'potty', label: 'Potty', icon: 'potty' },
      { id: 'book-song', label: 'Book & Song', icon: 'book-song' },
      { id: 'sleep', label: 'Sleep', icon: 'sleep' }
    ]
  }
};
