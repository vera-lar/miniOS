
export type MiniFile = {
  id: number;
  name: string;
  type: 'file' | 'folder';
  content: string;
};

const STORAGE_KEY = 'minios_filesystem';

export function getFiles(): MiniFile[] {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved) as MiniFile[];
    }

    // Default files for a new MiniOS installation
    const initialFiles: MiniFile[] = [
      {
        id: 1,
        name: 'Documents',
        type: 'folder',
        content: '',
      },
      {
        id: 2,
        name: 'Desktop',
        type: 'folder',
        content: '',
      },
      {
        id: 3,
        name: 'readme.txt',
        type: 'file',
        content: 'Welcome to MiniOS!\nYour virtual filesystem is ready.',
      },
    ];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialFiles)
    );

    return initialFiles;
  } catch {
    return [];
  }
}

export function saveFiles(files: MiniFile[]) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));

  // Notify other MiniOS pages in this browser tab
  window.dispatchEvent(new Event('minios-files-updated'));
}

export function createFile(
  name: string,
  type: 'file' | 'folder'
): MiniFile | null {
  const trimmedName = name.trim();

  if (!trimmedName) return null;

  const files = getFiles();

  const exists = files.some(
    (file) => file.name.toLowerCase() === trimmedName.toLowerCase()
  );

  if (exists) return null;

  const newFile: MiniFile = {
    id: Date.now(),
    name: trimmedName,
    type,
    content: '',
  };

  saveFiles([...files, newFile]);

  return newFile;
}

export function updateFile(id: number, content: string) {
  const files = getFiles();

  const updatedFiles = files.map((file) =>
    file.id === id ? { ...file, content } : file
  );

  saveFiles(updatedFiles);
}

export function deleteFile(id: number) {
  const files = getFiles();

  saveFiles(files.filter((file) => file.id !== id));
}
