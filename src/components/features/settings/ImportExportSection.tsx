import React, { useState, useRef } from 'react';
import { Download, Upload, CheckCircle, Warning } from 'phosphor-react';
import { Button } from '../../../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/Dialog';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Label } from '../../../components/ui/Label';
import { exportData, importData, downloadFile, readFileAsText } from '../../../services/importExportService';

// Type for checkbox onChange handler
type CheckedState = boolean | 'indeterminate';

interface ImportExportSectionProps {
  className?: string;
  onImportComplete?: () => void; // Callback to trigger UI refresh after import
}

const ImportExportSection: React.FC<ImportExportSectionProps> = ({ className = '', onImportComplete }) => {
  // State for export dialog
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportCategories, setExportCategories] = useState(true);
  const [exportFlows, setExportFlows] = useState(true);
  const [exportPrompts, setExportPrompts] = useState(true);
  const [exportVoiceChannels, setExportVoiceChannels] = useState(true);
  const [exportAgents, setExportAgents] = useState(true);
  const [exportAll, setExportAll] = useState(true);
  
  // State for import dialog
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importCategories, setImportCategories] = useState(true);
  const [importFlows, setImportFlows] = useState(true);
  const [importPrompts, setImportPrompts] = useState(true);
  const [importVoiceChannels, setImportVoiceChannels] = useState(true);
  const [importAgents, setImportAgents] = useState(true);
  const [importAll, setImportAll] = useState(true);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // State for notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle toggling all export options
  const handleToggleAllExport = (checked: CheckedState) => {
    const newValue = checked === true;
    setExportAll(newValue);
    setExportCategories(newValue);
    setExportFlows(newValue);
    setExportPrompts(newValue);
    setExportVoiceChannels(newValue);
    setExportAgents(newValue);
  };

  // Update exportAll state when individual options change
  React.useEffect(() => {
    const allSelected = exportCategories && exportFlows && exportPrompts && exportVoiceChannels && exportAgents;
    const noneSelected = !exportCategories && !exportFlows && !exportPrompts && !exportVoiceChannels && !exportAgents;
    
    // Only update if all are selected or none are selected to avoid loops
    if (allSelected !== exportAll && allSelected) {
      setExportAll(true);
    } else if (noneSelected) {
      setExportAll(false);
    }
  }, [exportCategories, exportFlows, exportPrompts, exportVoiceChannels, exportAgents, exportAll]);

  // Handle toggling all import options
  const handleToggleAllImport = (checked: CheckedState) => {
    const newValue = checked === true;
    setImportAll(newValue);
    setImportCategories(newValue);
    setImportFlows(newValue);
    setImportPrompts(newValue);
    setImportVoiceChannels(newValue);
    setImportAgents(newValue);
  };

  // Update importAll state when individual options change
  React.useEffect(() => {
    const allSelected = importCategories && importFlows && importPrompts && importVoiceChannels && importAgents;
    const noneSelected = !importCategories && !importFlows && !importPrompts && !importVoiceChannels && !importAgents;
    
    // Only update if all are selected or none are selected to avoid loops
    if (allSelected !== importAll && allSelected) {
      setImportAll(true);
    } else if (noneSelected) {
      setImportAll(false);
    }
  }, [importCategories, importFlows, importPrompts, importVoiceChannels, importAgents, importAll]);
  
  // Handle export button click
  const handleExport = async () => {
    try {
      const jsonData = await exportData({
        includeCategories: exportCategories,
        includeFlows: exportFlows,
        includePrompts: exportPrompts,
        includeVoiceChannels: exportVoiceChannels,
        includeAgents: exportAgents
      });
      
      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const filename = `yorizon-buddy-export-${date}.json`;
      
      // Download the file
      downloadFile(jsonData, filename, 'application/json');
      
      // Close dialog and show success notification
      setExportDialogOpen(false);
      setNotification({ type: 'success', message: 'Data exported successfully' });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setNotification({ 
        type: 'error', 
        message: `Error exporting data: ${error instanceof Error ? error.message : String(error)}` 
      });
      
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  };
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Trigger file input click
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };
  
  // Handle import button click
  const handleImport = async () => {
    if (!selectedFile) return;
    
    try {
      // Read the file content
      const fileContent = await readFileAsText(selectedFile);
      
      // Import the data
      const result = await importData(fileContent, {
        replaceExisting,
        importCategories,
        importFlows,
        importPrompts,
        importVoiceChannels,
        importAgents
      });
      
      // Close dialog and show notification
      setImportDialogOpen(false);
      setSelectedFile(null);
      setNotification({ 
        type: result.success ? 'success' : 'error', 
        message: result.message 
      });
      
      // Call the onImportComplete callback to refresh UI if import was successful
      if (result.success && onImportComplete) {
        onImportComplete();
      }
      
      // Clear notification after 3-5 seconds
      setTimeout(() => setNotification(null), result.success ? 3000 : 5000);
    } catch (error) {
      console.error('Import error:', error);
      setNotification({ 
        type: 'error', 
        message: `Error importing data: ${error instanceof Error ? error.message : String(error)}` 
      });
      
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  };
  
  return (
    <div className={`mt-8 border-t border-gray-700 pt-6 ${className}`}>
      <h3 className="text-lg font-medium mb-4">Import & Export Settings</h3>
      
      <div className="flex space-x-4">
        <Button 
          onClick={() => setExportDialogOpen(true)}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Download size={18} />
          <span>Export Settings</span>
        </Button>
        
        <Button 
          onClick={() => setImportDialogOpen(true)}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Upload size={18} />
          <span>Import Settings</span>
        </Button>
      </div>
      
      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Settings</DialogTitle>
            <DialogDescription>
              Select which settings you want to export. The exported file can be shared with other users.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-3">
            <div className="flex items-center space-x-2 border-b border-gray-700 pb-2 mb-2">
              <Checkbox 
                id="exportAll" 
                checked={exportAll} 
                onCheckedChange={handleToggleAllExport}
              />
              <Label htmlFor="exportAll" className="font-semibold">Select All</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exportCategories" 
                  checked={exportCategories} 
                  onCheckedChange={(checked: CheckedState) => setExportCategories(checked === true)}
                />
                <Label htmlFor="exportCategories">Categories</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exportFlows" 
                  checked={exportFlows} 
                  onCheckedChange={(checked: CheckedState) => setExportFlows(checked === true)}
                />
                <Label htmlFor="exportFlows">Flows</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exportPrompts" 
                  checked={exportPrompts} 
                  onCheckedChange={(checked: CheckedState) => setExportPrompts(checked === true)}
                />
                <Label htmlFor="exportPrompts">Prompts</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exportVoiceChannels" 
                  checked={exportVoiceChannels} 
                  onCheckedChange={(checked: CheckedState) => setExportVoiceChannels(checked === true)}
                />
                <Label htmlFor="exportVoiceChannels">Voice Channels</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exportAgents" 
                  checked={exportAgents} 
                  onCheckedChange={(checked: CheckedState) => setExportAgents(checked === true)}
                />
                <Label htmlFor="exportAgents">Agents</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleExport}
              disabled={!exportCategories && !exportFlows && !exportPrompts && !exportVoiceChannels && !exportAgents}
            >
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Settings</DialogTitle>
            <DialogDescription>
              Select a settings file to import and choose which data to include.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {/* File selection */}
            <div className="space-y-2">
              <Label>Settings File</Label>
              <div className="flex items-center space-x-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept=".json" 
                  className="hidden" 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={openFileSelector}
                  className="flex-1 text-left justify-start"
                >
                  {selectedFile ? selectedFile.name : 'Select file...'}
                </Button>
              </div>
            </div>
            
            {/* Import options */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-gray-700 pb-2 mb-2">
                <Checkbox 
                  id="importAll" 
                  checked={importAll} 
                  onCheckedChange={handleToggleAllImport}
                />
                <Label htmlFor="importAll" className="font-semibold">Select All</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="importCategories" 
                    checked={importCategories} 
                    onCheckedChange={(checked: CheckedState) => setImportCategories(checked === true)}
                  />
                  <Label htmlFor="importCategories">Categories</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="importFlows" 
                    checked={importFlows} 
                    onCheckedChange={(checked: CheckedState) => setImportFlows(checked === true)}
                  />
                  <Label htmlFor="importFlows">Flows</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="importPrompts" 
                    checked={importPrompts} 
                    onCheckedChange={(checked: CheckedState) => setImportPrompts(checked === true)}
                  />
                  <Label htmlFor="importPrompts">Prompts</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="importVoiceChannels" 
                    checked={importVoiceChannels} 
                    onCheckedChange={(checked: CheckedState) => setImportVoiceChannels(checked === true)}
                  />
                  <Label htmlFor="importVoiceChannels">Voice Channels</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="importAgents" 
                    checked={importAgents} 
                    onCheckedChange={(checked: CheckedState) => setImportAgents(checked === true)}
                  />
                  <Label htmlFor="importAgents">Agents</Label>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2 border-t border-gray-700">
                <Checkbox 
                  id="replaceExisting" 
                  checked={replaceExisting} 
                  onCheckedChange={(checked: CheckedState) => setReplaceExisting(checked === true)}
                />
                <Label htmlFor="replaceExisting" className="text-amber-400">
                  Replace existing data (caution: this will delete current data)
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleImport}
              disabled={
                !selectedFile || 
                (!importCategories && !importFlows && !importPrompts && !importVoiceChannels && !importAgents)
              }
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Notification */}
      {notification && (
        <div 
          className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg flex items-center space-x-2 ${notification.type === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}
        >
          {notification.type === 'success' ? (
            <CheckCircle size={20} weight="fill" />
          ) : (
            <Warning size={20} weight="fill" />
          )}
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default ImportExportSection;
