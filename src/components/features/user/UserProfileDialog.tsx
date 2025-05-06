import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Label } from '../../../components/ui/Label';
import { User } from 'phosphor-react';
// Using User type from UseUserProfileReturn
import { UseUserProfileReturn } from '../../../hooks/useUserProfile';

interface UserProfileDialogProps extends UseUserProfileReturn {}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  userData,
  newUser,
  userDialogOpen,
  setNewUser,
  setUserDialogOpen,
  handleUserSubmit
}) => {
  return (
    <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2 text-sm font-medium"
        >
          <User size={16} />
          <span>{userData?.name || 'Set Up Profile'}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Set up your user profile information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userName" className="text-right">
              Name
            </Label>
            <Input
              id="userName"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userEmail" className="text-right">
              Email
            </Label>
            <Input
              id="userEmail"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userUrl" className="text-right">
              URL
            </Label>
            <Input
              id="userUrl"
              type="url"
              value={newUser.url}
              onChange={(e) => setNewUser({...newUser, url: e.target.value})}
              className="col-span-3"
              placeholder="https://example.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userMissionStatement" className="text-right">
              Mission
            </Label>
            <Textarea
              id="userMissionStatement"
              value={newUser.missionStatement}
              onChange={(e) => setNewUser({...newUser, missionStatement: e.target.value})}
              className="col-span-3"
              placeholder="Your mission statement"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUserSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
