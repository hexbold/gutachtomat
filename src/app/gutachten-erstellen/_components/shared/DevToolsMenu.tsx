import { useRef, useState } from 'react';
import * as FormTypes from '@/lib/core/form-types';
import { createMinimalJSON } from '@/lib/utils/json-utils';
import {
  Cog6ToothIcon,
  SparklesIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ClipboardIcon,
  PencilSquareIcon,
  QueueListIcon
} from '@heroicons/react/24/outline';

interface DevToolsMenuProps {
  formData: FormTypes.Form;
  viewMode: 'wizard' | 'form';
  generateRandomData: () => void;
  setViewMode: (mode: 'wizard' | 'form') => void;
  dispatch: React.Dispatch<FormTypes.FormAction>;
}

export function DevToolsMenu({
  formData,
  viewMode,
  generateRandomData,
  setViewMode,
  dispatch,
}: DevToolsMenuProps) {
  const [isDevMenuOpen, setIsDevMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mergeFileInputRef = useRef<HTMLInputElement>(null);

  // Export formData as JSON file
  const handleExport = () => {
    const minimalData = createMinimalJSON(formData);
    const dataStr = JSON.stringify(minimalData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gutachten-formdata-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setIsDevMenuOpen(false);
  };

  // Import formData from JSON file (complete overwrite)
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        // Complete overwrite: merge with initial state, then apply imported data
        const completeData = {
          ...FormTypes.initialFormState.formData,
          ...importedData,
        };
        dispatch({ type: 'SET_MULTIPLE_FIELDS', data: completeData });
        alert('✅ Daten erfolgreich importiert (komplett überschrieben)');
      } catch (error: unknown) {
        console.error('Import error:', error);
        alert('❌ Fehler beim Importieren: Ungültige JSON-Datei');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsDevMenuOpen(false);
  };

  // Merge JSON with existing formData (smart merge)
  const handleMerge = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        // Smart merge: only fills empty fields, never overwrites existing values
        dispatch({ type: 'RESTORE_STATE', payload: importedData });
        alert('✅ Daten erfolgreich zusammengeführt (nur leere Felder wurden gefüllt)');
      } catch (error: unknown) {
        console.error('Merge error:', error);
        alert('❌ Fehler beim Zusammenführen: Ungültige JSON-Datei');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (mergeFileInputRef.current) {
      mergeFileInputRef.current.value = '';
    }
    setIsDevMenuOpen(false);
  };

  // Copy formData to clipboard
  const handleCopy = async () => {
    try {
      const minimalData = createMinimalJSON(formData);
      await navigator.clipboard.writeText(JSON.stringify(minimalData, null, 2));
      alert('✅ FormData in Zwischenablage kopiert');
    } catch (error: unknown) {
      console.error('Copy error:', error);
      alert('❌ Fehler beim Kopieren in Zwischenablage');
    }
    setIsDevMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDevMenuOpen(!isDevMenuOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
        title="Dev Tools"
      >
        <Cog6ToothIcon className="w-4 h-4" />
        <span>Dev</span>
      </button>

      {/* Dropdown Menu */}
      {isDevMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[70]">
          <button
            onClick={() => {
              setIsDevMenuOpen(false);
              generateRandomData();
            }}
            className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm text-gray-700 cursor-pointer"
          >
            <SparklesIcon className="w-5 h-5" />
            <span>Testdaten generieren</span>
          </button>

          <div className="border-t border-gray-200 my-2"></div>

          <button
            onClick={handleExport}
            className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm text-gray-700 cursor-pointer"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm text-gray-700 cursor-pointer"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>Import JSON (overwrite)</span>
          </button>

          <button
            onClick={() => mergeFileInputRef.current?.click()}
            className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm text-gray-700 cursor-pointer"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span>Merge JSON</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm text-gray-700 cursor-pointer"
          >
            <ClipboardIcon className="w-5 h-5" />
            <span>Copy JSON</span>
          </button>

          <div className="border-t border-gray-200 my-2"></div>

          <button
            onClick={() => {
              setViewMode(viewMode === 'wizard' ? 'form' : 'wizard');
              setIsDevMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm text-gray-700 cursor-pointer"
          >
            {viewMode === 'wizard' ? <PencilSquareIcon className="w-5 h-5" /> : <QueueListIcon className="w-5 h-5" />}
            <span>{viewMode === 'wizard' ? 'Formular Ansicht' : 'Wizard Ansicht'}</span>
          </button>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
      <input
        ref={mergeFileInputRef}
        type="file"
        accept=".json"
        onChange={handleMerge}
        className="hidden"
      />
    </div>
  );
}
