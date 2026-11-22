
'use client';

import { useEffect, useState } from 'react';
import {
  File,
  Folder,
  Plus,
  Trash2,
  Save,
  X,
  FileEdit,
} from 'lucide-react';

import {
  type MiniFile,
  getFiles,
  createFile,
  updateFile,
  deleteFile,
} from '../filesystem';

export default function FilesPage() {
  const [items, setItems] = useState<MiniFile[]>([]);
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState<MiniFile | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    setItems(getFiles());

    const refreshFiles = () => setItems(getFiles());

    window.addEventListener('minios-files-updated', refreshFiles);

    return () => {
      window.removeEventListener('minios-files-updated', refreshFiles);
    };
  }, []);

  function handleCreate(type: 'file' | 'folder') {
    if (!name.trim()) {
      alert('Enter a name first.');
      return;
    }

    const newItem = createFile(name, type);

    if (!newItem) {
      alert('This name already exists or is invalid.');
      return;
    }

    setName('');
    setItems(getFiles());
  }

  function openFile(item: MiniFile) {
    if (item.type === 'folder') {
      alert('Folder navigation will be added later.');
      return;
    }

    setSelectedFile(item);
    setContent(item.content);
  }

  function handleSave() {
    if (!selectedFile) return;

    updateFile(selectedFile.id, content);

    setItems(getFiles());

    setSelectedFile({
      ...selectedFile,
      content,
    });

    alert('File saved successfully!');
  }

  function handleDelete(id: number) {
    deleteFile(id);

    if (selectedFile?.id === id) {
      setSelectedFile(null);
      setContent('');
    }

    setItems(getFiles());
  }

  return (
    <div className="min-h-full bg-gray-950 text-white p-6">

      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-400">
            File Manager
          </h1>

          <p className="text-gray-400 mt-2">
            Create, edit and manage your MiniOS files.
          </p>
        </div>
      </div>

      {/* CREATE FILES AND FOLDERS */}
      <div className="flex flex-wrap gap-3 mt-6">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreate('file');
          }}
          placeholder="Enter file or folder name"
          className="bg-gray-800 border border-gray-700 p-3 rounded-md outline-none focus:border-blue-500"
        />

        <button
          onClick={() => handleCreate('file')}
          className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          <Plus size={16} />
          New File
        </button>

        <button
          onClick={() => handleCreate('folder')}
          className="flex gap-2 items-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
        >
          <Plus size={16} />
          New Folder
        </button>

      </div>

      {/* FILE LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 bg-gray-900 border border-gray-800 p-4 rounded-lg"
          >
            <button
              onClick={() => openFile(item)}
              className="flex items-center gap-3 min-w-0 text-left flex-1"
            >
              {item.type === 'folder' ? (
                <Folder className="text-yellow-400 shrink-0" />
              ) : (
                <File className="text-blue-400 shrink-0" />
              )}

              <span className="truncate">{item.name}</span>
            </button>

            <button
              onClick={() => handleDelete(item.id)}
              title="Delete"
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

      </div>

      {/* FILE EDITOR */}
      {selectedFile && (
        <div className="mt-10 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">

          <div className="flex justify-between items-center gap-3 p-4 border-b border-gray-700">

            <div className="flex items-center gap-2">
              <FileEdit className="text-blue-400" />
              <h2 className="font-semibold">
                Editing: {selectedFile.name}
              </h2>
            </div>

            <button
              onClick={() => setSelectedFile(null)}
              title="Close editor"
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
            placeholder="Write your file contents here..."
            className="w-full h-72 bg-gray-950 p-5 font-mono text-sm text-green-400 outline-none resize-y"
          />

          <div className="p-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg"
            >
              <Save size={18} />
              Save File
            </button>
          </div>

        </div>
      )}

      <p className="text-gray-500 text-sm mt-6">
        Total items: {items.length}
      </p>

    </div>
  );
}
