import { db } from './db';

// Define the structure for exported data
export interface ExportData {
  version: string;
  timestamp: string;
  data: {
    categories?: any[];
    flows?: any[];
    prompts?: any[];
    voiceChannels?: any[];
    agents?: any[];
  };
}

// Current export version
const EXPORT_VERSION = '1.0.0';

/**
 * Export all user data to a JSON file
 * @param includeCategories Whether to include categories in the export
 * @param includeFlows Whether to include flows in the export
 * @param includePrompts Whether to include prompts in the export
 * @param includeVoiceChannels Whether to include voice channels in the export
 * @param includeAgents Whether to include agents in the export
 * @returns A JSON string containing the exported data
 */
export async function exportData({
  includeCategories = true,
  includeFlows = true,
  includePrompts = true,
  includeVoiceChannels = true,
  includeAgents = true
}: {
  includeCategories?: boolean;
  includeFlows?: boolean;
  includePrompts?: boolean;
  includeVoiceChannels?: boolean;
  includeAgents?: boolean;
} = {}): Promise<string> {
  const exportData: ExportData = {
    version: EXPORT_VERSION,
    timestamp: new Date().toISOString(),
    data: {}
  };

  // Export categories if requested
  if (includeCategories) {
    const categories = await db.categories.toArray();
    // Ensure dates are properly serialized
    exportData.data.categories = categories.map(category => ({
      ...category,
      createdAt: category.createdAt instanceof Date ? category.createdAt.toISOString() : category.createdAt,
      updatedAt: category.updatedAt instanceof Date ? category.updatedAt.toISOString() : category.updatedAt
    }));
  }

  // Export flows if requested
  if (includeFlows) {
    // Get all flows
    const flows = await db.flows.toArray();
    
    // Get all categories to filter out flows with invalid category IDs
    const categories = await db.categories.toArray();
    const categoryIds = new Set(categories.map(cat => cat.id));
    
    // Filter out flows with invalid category IDs (orphaned flows)
    const validFlows = flows.filter(flow => flow.categoryId && categoryIds.has(flow.categoryId));
    
    console.log('Exporting flows (filtered):', validFlows);
    
    // Ensure dates are properly serialized
    exportData.data.flows = validFlows.map(flow => ({
      ...flow,
      createdAt: flow.createdAt instanceof Date ? flow.createdAt.toISOString() : flow.createdAt,
      updatedAt: flow.updatedAt instanceof Date ? flow.updatedAt.toISOString() : flow.updatedAt
    }));
  }

  // Export prompts if requested
  if (includePrompts) {
    exportData.data.prompts = await db.prompts.toArray();
  }

  // Export voice channels if requested
  if (includeVoiceChannels) {
    exportData.data.voiceChannels = await db.voiceChannels.toArray();
  }

  // Export agents if requested
  if (includeAgents) {
    exportData.data.agents = await db.agents.toArray();
  }

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import data from a JSON string
 * @param jsonData The JSON string containing the data to import
 * @param options Import options
 * @returns A result object indicating success or failure
 */
export async function importData(
  jsonData: string,
  {
    replaceExisting = false,
    importCategories = true,
    importFlows = true,
    importPrompts = true,
    importVoiceChannels = true,
    importAgents = true
  }: {
    replaceExisting?: boolean;
    importCategories?: boolean;
    importFlows?: boolean;
    importPrompts?: boolean;
    importVoiceChannels?: boolean;
    importAgents?: boolean;
  } = {}
): Promise<{ success: boolean; message: string }> {
  try {
    // Parse the JSON data
    const parsedData = JSON.parse(jsonData) as ExportData;

    // Validate the data structure
    if (!parsedData || !parsedData.version || !parsedData.data) {
      return { success: false, message: 'Invalid import data format' };
    }

    // Start a transaction for all database operations
    return await db.transaction('rw', 
      [db.categories, db.flows, db.prompts, db.voiceChannels, db.agents], 
      async () => {
        // Create a mapping of old category IDs to new category IDs
        const categoryIdMap = new Map();
        // Import categories if requested
        if (importCategories && parsedData.data.categories) {
          if (replaceExisting) {
            await db.categories.clear();
          }
          // Remove IDs to avoid conflicts if not replacing and convert date strings back to Date objects
          const categoriesToImport = (replaceExisting 
            ? parsedData.data.categories 
            : parsedData.data.categories.map(({ id, ...rest }) => rest)
          ).map(category => ({
            ...category,
            createdAt: category.createdAt ? new Date(category.createdAt) : new Date(),
            updatedAt: category.updatedAt ? new Date(category.updatedAt) : new Date()
          }));
          console.log('Categories to import (processed):', categoriesToImport);
          
          // For each category in the import, store its original ID
          const originalCategoryIds = parsedData.data.categories.map(cat => cat.id);
          
          // Add categories and get the new IDs
          const newCategoryIds = await db.categories.bulkAdd(categoriesToImport, { allKeys: true });
          
          // Build a mapping from original IDs to new IDs
          originalCategoryIds.forEach((oldId, index) => {
            if (oldId !== undefined) {
              categoryIdMap.set(oldId, newCategoryIds[index]);
            }
          });
          
          console.log('Category ID mapping:', Object.fromEntries(categoryIdMap));
          
          // Verify categories were imported
          const importedCategories = await db.categories.toArray();
          console.log('Categories after import:', importedCategories);
        }

        // Import flows if requested
        if (importFlows && parsedData.data.flows) {
          console.log('Importing flows:', parsedData.data.flows);
          if (replaceExisting) {
            await db.flows.clear();
          }
          // Remove IDs to avoid conflicts if not replacing and convert date strings back to Date objects
          const flowsToImport = (replaceExisting 
            ? parsedData.data.flows 
            : parsedData.data.flows.map(({ id, ...rest }) => rest)
          ).map(flow => {
            // Get the original category ID
            const originalCategoryId = typeof flow.categoryId === 'string' ? parseInt(flow.categoryId, 10) : flow.categoryId;
            
            // Map to the new category ID if available, otherwise keep the original
            const newCategoryId = categoryIdMap.has(originalCategoryId) 
              ? categoryIdMap.get(originalCategoryId) 
              : originalCategoryId;
              
            console.log(`Mapping flow category ID: ${originalCategoryId} -> ${newCategoryId}`);
            
            return {
              ...flow,
              createdAt: flow.createdAt ? new Date(flow.createdAt) : new Date(),
              updatedAt: flow.updatedAt ? new Date(flow.updatedAt) : new Date(),
              // Use the mapped category ID
              categoryId: newCategoryId,
              // Ensure promptId is a number or null
              promptId: flow.promptId ? (typeof flow.promptId === 'string' ? parseInt(flow.promptId, 10) : flow.promptId) : null
            };
          });
          console.log('Flows to import (processed):', flowsToImport);
          await db.flows.bulkAdd(flowsToImport);
          // Verify flows were imported
          const importedFlows = await db.flows.toArray();
          console.log('Flows after import:', importedFlows);
        }

        // Import prompts if requested
        if (importPrompts && parsedData.data.prompts) {
          if (replaceExisting) {
            await db.prompts.clear();
          }
          // Remove IDs to avoid conflicts if not replacing
          const promptsToImport = replaceExisting 
            ? parsedData.data.prompts 
            : parsedData.data.prompts.map(({ id, ...rest }) => rest);
          await db.prompts.bulkAdd(promptsToImport);
        }

        // Import voice channels if requested
        if (importVoiceChannels && parsedData.data.voiceChannels) {
          if (replaceExisting) {
            await db.voiceChannels.clear();
          }
          // Remove IDs to avoid conflicts if not replacing
          const voiceChannelsToImport = replaceExisting 
            ? parsedData.data.voiceChannels 
            : parsedData.data.voiceChannels.map(({ id, ...rest }) => rest);
          await db.voiceChannels.bulkAdd(voiceChannelsToImport);
        }

        // Import agents if requested
        if (importAgents && parsedData.data.agents) {
          if (replaceExisting) {
            await db.agents.clear();
          }
          // Remove IDs to avoid conflicts if not replacing
          const agentsToImport = replaceExisting 
            ? parsedData.data.agents 
            : parsedData.data.agents.map(({ id, ...rest }) => rest);
          await db.agents.bulkAdd(agentsToImport);
        }

        return { 
          success: true, 
          message: 'Data imported successfully' 
        };
    });
  } catch (error) {
    console.error('Import error:', error);
    return { 
      success: false, 
      message: `Error importing data: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

/**
 * Helper function to trigger a file download
 * @param content The content to download
 * @param fileName The name of the file
 * @param contentType The content type of the file
 */
export function downloadFile(content: string, fileName: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Helper function to read a file as text
 * @param file The file to read
 * @returns A promise that resolves to the file content as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    reader.readAsText(file);
  });
}
