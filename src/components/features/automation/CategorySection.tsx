import React from 'react';
import { FolderSimple } from 'phosphor-react';
import { Button } from '../../../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Label } from '../../../components/ui/Label';
import { Info, Plus, PencilSimple, Trash } from 'phosphor-react';
// Using Category type from UseCategoryManagementReturn
import { UseCategoryManagementReturn } from '../../../hooks/useCategoryManagement';

interface CategorySectionProps extends UseCategoryManagementReturn {}

const CategorySection: React.FC<CategorySectionProps> = ({
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
  handleCategoryInfo
}) => {
  return (
    <div className="space-y-4">
      {/* Section Title */}
      <h2 className="text-xl font-semibold text-void-black dark:text-white mb-2">Categories</h2>
      {/* Category Actions */}
      <div className="flex space-x-4 mb-8 ml-2 mt-10">
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-1"
              onClick={() => {
                setIsEditingCategory(false);
                setNewCategory({ name: '', description: '' });
              }}
            >
              <Plus size={16} />
              <span>Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
              <DialogDescription>
                {isEditingCategory ? 'Update an existing category.' : 'Add a new category for organizing your flows.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="categoryName" className="text-right">
                  Name
                </Label>
                <Input
                  id="categoryName"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="categoryDescription" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="categoryDescription"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCategorySubmit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center space-x-1" 
          disabled={!selectedCategory}
          onClick={() => selectedCategory && handleCategoryEdit(categories.find(c => c.id === selectedCategory)!)}
        >
          <PencilSimple size={16} />
          <span>Edit</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center space-x-1" 
          disabled={!selectedCategory}
          onClick={() => selectedCategory && handleCategoryDelete(selectedCategory)}
        >
          <Trash size={16} />
          <span>Delete</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center space-x-1" 
          disabled={!selectedCategory}
          onClick={() => selectedCategory && handleCategoryInfo(categories.find(c => c.id === selectedCategory)!)}
        >
          <Info size={16} />
          <span>Info</span>
        </Button>
      </div>
      
      {/* Category List */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-6 mt-16">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div 
              key={category.id} 
              className={`${selectedCategory === category.id ? 'bg-void-black text-white' : 'bg-transparent dark:text-white text-void-black'} p-4 rounded-lg text-center cursor-pointer aspect-square flex flex-col justify-center border ${selectedCategory === category.id ? 'border-neon-pulse border-2' : 'border-border-gray'} transition-all duration-200`}
              onClick={() => handleCategorySelect(category.id || 0)}
            >
              <FolderSimple size={24} weight="regular" className="mx-auto mb-2" />
              <div className="font-medium">{category.name}</div>
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center py-4 text-gray-500">
            No categories yet. Click "Add" to create your first category.
          </div>
        )}
      </div>
    </div>
  );

  function handleCategorySelect(categoryId: number) {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  }
};

export default CategorySection;
