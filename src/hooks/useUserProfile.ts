import { useState, useEffect, useCallback } from 'react';
import { db, User } from '../services/db';

export interface UserFormData {
  name: string;
  email: string;
  url: string;
  missionStatement: string;
}

export interface UseUserProfileReturn {
  userData: User | null;
  newUser: UserFormData;
  userDialogOpen: boolean;
  setNewUser: (user: UserFormData) => void;
  setUserDialogOpen: (open: boolean) => void;
  handleUserSubmit: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [userData, setUserData] = useState<User | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<UserFormData>({
    name: '',
    email: '',
    url: '',
    missionStatement: ''
  });

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      const user = await db.getUser();
      // Convert undefined to null to match state type
      setUserData(user || null);
      
      if (user) {
        setNewUser({
          name: user.name || '',
          email: user.email || '',
          url: user.url || '',
          missionStatement: user.missionStatement || ''
        });
      }
    };

    loadUserData();
  }, []);

  // Handle user submission
  const handleUserSubmit = useCallback(async () => {
    if (!newUser.name.trim()) return;

    try {
      await db.saveUser(newUser); // Save user data
      // Get the updated user directly from the database
      const updatedUser = await db.getUser();
      setUserData(updatedUser || null);
      setUserDialogOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }, [newUser]);

  return {
    userData,
    newUser,
    userDialogOpen,
    setNewUser,
    setUserDialogOpen,
    handleUserSubmit
  };
};
