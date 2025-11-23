import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface AppItem {
  id: string;
  [key: string]: any;
}

interface AppContextType {
  items: AppItem[];
  addItem: (item: AppItem) => void;
  editItem: (id: string, updatedItem: AppItem) => void;
  deleteItem: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<AppItem[]>('app_items', []);

  const addItem = (item: AppItem) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  const editItem = (id: string, updatedItem: AppItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? updatedItem : item))
    );
  };

  const deleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const value: AppContextType = {
    items,
    addItem,
    editItem,
    deleteItem,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
}
