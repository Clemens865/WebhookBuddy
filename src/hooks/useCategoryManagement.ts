import { useState, useEffect, useCallback } from 'react';
import { db, Category } from '../services/db';

export interface CategoryFormData {
  name: string;
  description: string;
}

export interface UseCategoryManagementReturn {
  categories: Category[];
  selectedCategory: number | null;
  isEditingCategory: boolean;
  categoryDialogOpen: boolean;
  newCategory: CategoryFormData;
  setSelectedCategory: (id: number | null) => void;
  setCategoryDialogOpen: (open: boolean) => void;
  setNewCategory: (category: CategoryFormData) => void;
  setIsEditingCategory: (isEditing: boolean) => void;
  handleCategorySubmit: () => Promise<void>;
  handleCategoryEdit: (category: Category) => void;
  handleCategoryDelete: (id: number) => Promise<void>;
  handleCategoryInfo: (category: Category) => void;
  getCategoryColor: (id: number) => string;
}

export const useCategoryManagement = (refreshTrigger: number = 0): UseCategoryManagementReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<CategoryFormData>({
    name: '',
    description: ''
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      const allCategories = await db.getCategories();
      setCategories(allCategories);
    };

    loadCategories();
  }, [refreshTrigger]); // Re-run when refreshTrigger changes

  // Handle category submission (create or update)
  const handleCategorySubmit = useCallback(async () => {
    if (!newCategory.name.trim()) return;

    try {
      if (isEditingCategory && selectedCategory) {
        await db.updateCategory(selectedCategory, newCategory);
      } else {
        await db.createCategory(newCategory);
      }

      // Refresh categories
      const updatedCategories = await db.getCategories();
      setCategories(updatedCategories);
      
      // Reset form and close dialog
      setNewCategory({ name: '', description: '' });
      setCategoryDialogOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  }, [newCategory, isEditingCategory, selectedCategory]);

  // Handle category edit
  const handleCategoryEdit = useCallback((category: Category) => {
    setIsEditingCategory(true);
    setNewCategory({
      name: category.name,
      description: category.description || ''
    });
    setCategoryDialogOpen(true);
  }, []);

  // Handle category delete
  const handleCategoryDelete = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? All associated flows will also be deleted.')) {
      try {
        await db.deleteCategory(id);
        
        // Refresh categories
        const updatedCategories = await db.getCategories();
        setCategories(updatedCategories);
        
        // Clear selection if the deleted category was selected
        if (selectedCategory === id) {
          setSelectedCategory(null);
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  }, [selectedCategory]);

  // Handle category info display
  const handleCategoryInfo = useCallback((category: Category) => {
    alert(`Category: ${category.name}\nDescription: ${category.description || 'No description'}\nCreated: ${category.createdAt?.toLocaleString() || 'Unknown'}`);
  }, []);

  // Get category color based on ID
  const getCategoryColor = useCallback((id: number) => {
    const colors = [
      'bg-blue-600 text-white',
      'bg-purple-600 text-white',
      'bg-green-600 text-white',
      'bg-yellow-600 text-white',
      'bg-red-600 text-white',
      'bg-indigo-600 text-white',
      'bg-pink-600 text-white',
      'bg-teal-600 text-white'
    ];
    return colors[id % colors.length];
  }, []);

  return {
    categories,
    selectedCategory,
    isEditingCategory,
    categoryDialogOpen,
    newCategory,
    setSelectedCategory,
    setCategoryDialogOpen,
    setNewCategory,
    setIsEditingCategory,
    handleCategorySubmit,
    handleCategoryEdit,
    handleCategoryDelete,
    handleCategoryInfo,
    getCategoryColor
  };
};
