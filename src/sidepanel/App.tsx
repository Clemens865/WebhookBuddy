import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Switch } from '../components/ui/Switch';
import UserProfileDialog from '../components/features/user/UserProfileDialog';
import CategorySection from '../components/features/automation/CategorySection';
import FlowSection from '../components/features/automation/FlowSection';
import PromptSection from '../components/features/prompts/PromptSection';
import VoiceChannelSection from '../components/features/voice/VoiceChannelSection';
import AgentSection from '../components/features/agent/AgentSection';
import ImportExportSection from '../components/features/settings/ImportExportSection';
import { useCategoryManagement } from '../hooks/useCategoryManagement';
import { useFlowManagement } from '../hooks/useFlowManagement';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePromptManagement } from '../hooks/usePromptManagement';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('automation');
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger data refresh

  // Custom hooks
  const userProfile = useUserProfile();
  const categoryManagement = useCategoryManagement(refreshTrigger);
  const flowManagement = useFlowManagement(categoryManagement.selectedCategory, refreshTrigger);
  const promptManagement = usePromptManagement();
  
  // Store dark mode preference in local storage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Load dark mode preference from local storage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-background text-foreground`}>
      {/* Logo and App Name Header */}
      <div className="p-4 flex items-center justify-center border-b border-divider-gray">
        <div className="flex items-center">
          <img 
            src="/icons/icon-48.png" 
            alt="Webhook Buddy Logo" 
            className="h-10 w-auto mr-3" 
          />
          <h1 className="text-xl font-semibold">Webhook Buddy</h1>
        </div>
      </div>
      
      {/* User Profile and Theme Switcher */}
      <div className="p-4 flex items-center justify-between border-b border-divider-gray">
        <UserProfileDialog
          {...userProfile}
        />
        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-sm">{darkMode ? 'Dark' : 'Light'}</span>
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            aria-label="Toggle theme"
            className={`theme-switch ${darkMode ? 'theme-switch-dark' : 'theme-switch-light'}`}
          />
        </div>
      </div>
      
      <main className="container mx-auto p-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="agent">Agent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="automation" className="space-y-8 pt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <CategorySection
                  {...categoryManagement}
                />
              </div>
              <div className="md:col-span-2">
                <FlowSection
                  {...flowManagement}
                  selectedCategory={categoryManagement.selectedCategory}
                />
              </div>
            </div>
            <ImportExportSection 
              onImportComplete={() => {
                // Force a complete refresh of all data by incrementing the refresh trigger
                setRefreshTrigger(prev => prev + 1);
                console.log('Triggering data refresh after import');
              }}
            />
          </TabsContent>
          
          <TabsContent value="prompts" className="space-y-4 pt-10">
            <PromptSection
              {...promptManagement}
            />
          </TabsContent>
          
          <TabsContent value="voice" className="space-y-4 pt-10">
            <VoiceChannelSection />
          </TabsContent>
          
          <TabsContent value="agent" className="space-y-4 pt-10 h-[calc(100vh-150px)]" >
            <AgentSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default App;
