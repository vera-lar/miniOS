
'use client';

import { useEffect, useState } from 'react';
import {
  Play,
  Terminal,
  FileCode,
  RefreshCw,
} from 'lucide-react';

import {
  MiniFile,
  getFiles,
} from '../filesystem';

export default function RunPage() {
  const [files, setFiles] = useState<MiniFile[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [result, setResult] = useState('');
  const [preview, setPreview] = useState('');
  const [running, setRunning] = useState(false);

  const selectedFile = files.find(
    (file) => file.id === selectedId && file.type === 'file'
  );

  useEffect(() => {
    const refreshFiles = () => {
      setFiles(getFiles());
    };

    refreshFiles();

    window.addEventListener('minios-files-updated', refreshFiles);

    return () => {
      window.removeEventListener('minios-files-updated', refreshFiles);
    };
  }, []);

  function runSelectedFile() {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const extension = selectedFile.name
      .split('.')
      .pop()
      ?.toLowerCase();

    const code = selectedFile.content;

    setResult('');
    setPreview('');
    setRunning(true);

    if (extension === 'html' || extension === 'htm') {
      setPreview(code);
      setRunning(false);
      return;
    }

    if (extension === 'js') {
      // Execute JavaScript inside a restricted iframe.
      // Its console output is displayed in the iframe.
      const safeCode = JSON.stringify(code).replace(/</g, '\\u003c');

      const documentContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              background: #030712;
              color: #4ade80;
              font-family: monospace;
              padding: 20px;
              white-space: pre-wrap;
            }
            .heading {
              color: #60a5fa;
              margin-bottom: 15px;
            }
          </style>
        </head>
        <body>
          <div class="heading">MiniOS JavaScript Console</div>
          <pre id="output"></pre>

          <script>
            const output = document.getElementById('output');

            console.log = (...args) => {
              output.textContent += args.map(value =>
                typeof value === 'object'
                  ? JSON.stringify(value)
                  : String(value)
              ).join(' ') + '\\n';
            };

            console.error = (...args) => {
              output.textContent += 'ERROR: ' +
                args.map(String).join(' ') + '\\n';
            };

            console.warn = (...args) => {
              output.textContent += 'WARNING: ' +
                args.map(String).join(' ') + '\\n';
            };

            try {
              const userCode = ${safeCode};
              new Function(userCode)();

              if (!output.textContent) {
                output.textContent = 'Program executed successfully. No console output.';
              }
            } catch (error) {
              output.textContent += 'ERROR: ' + error.message;
            }
          </script>
        </body>
        </html>
      `;

      setPreview(documentContent);
      setRunning(false);
      return;
    }

    if (extension === 'txt' || extension === 'json') {
      if (extension === 'json') {
        try {
          setResult(JSON.stringify(JSON.parse(code), null, 2));
        } catch {
          setResult('Invalid JSON file.');
        }
      } else {
        setResult(code || 'This file is empty.');
      }

      setRunning(false);
      return;
    }

    if (extension === 'css') {
      setResult(
        'CSS is a stylesheet, not an executable program. Open an HTML file to use it in a webpage preview.'
      );
      setRunning(false);
      return;
    }

    setResult(
      `The .${extension || 'unknown'} file type is not supported by this MiniOS runner yet.`
    );

    setRunning(false);
  }

  return (
    <div className="min-h-full bg-gray-950 text-white p-6">

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-blue-400">
            MiniOS Run
          </h1>

          <p className="text-gray-400 mt-2">
            Select and execute files from your MiniOS filesystem.
          </p>
        </div>

        <button
          onClick={() => setFiles(getFiles())}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg"
        >
          <RefreshCw size={17} />
          Refresh Files
        </button>

      </div>

      {/* FILE SELECTION */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

        <div className="flex items-center gap-2 mb-4">
          <FileCode className="text-blue-400" />
          <h2 className="font-semibold">Select Application</h2>
        </div>

        <select
          value={selectedId ?? ''}
          onChange={(e) => {
            setSelectedId(e.target.value ? Number(e.target.value) : null);
            setResult('');
            setPreview('');
          }}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 outline-none"
        >
          <option value="">Choose a file...</option>

          {files
            .filter((file) => file.type === 'file')
            .map((file) => (
              <option key={file.id} value={file.id}>
                {file.name}
              </option>
            ))}
        </select>

        {selectedFile && (
          <div className="mt-5">

            <p className="text-sm text-gray-400 mb-2">
              Selected file: {selectedFile.name}
            </p>

            <pre className="bg-black border border-gray-800 rounded-lg p-4 overflow-auto max-h-64 text-green-400 text-sm font-mono whitespace-pre-wrap">
              {selectedFile.content || 'This file is empty.'}
            </pre>

            <button
              onClick={runSelectedFile}
              disabled={running}
              className="flex items-center gap-2 mt-5 bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold"
            >
              <Play size={18} />
              {running ? 'Running...' : 'Run Selected File'}
            </button>

          </div>
        )}

        {files.filter((file) => file.type === 'file').length === 0 && (
          <p className="text-gray-500 text-sm mt-4">
            No files available. Create a file in File Manager first.
          </p>
        )}

      </div>

      {/* OUTPUT */}
      <div className="mt-8">

        <div className="flex items-center gap-2 mb-4">
          <Terminal className="text-green-400" />
          <h2 className="text-lg font-semibold">Execution Output</h2>
        </div>

        <div className="bg-black border border-gray-800 rounded-xl p-5 min-h-32">
          <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
            {result || 'Your program output will appear here.'}
          </pre>
        </div>

      </div>

      {/* HTML AND JAVASCRIPT PREVIEW */}
      {preview && (
        <div className="mt-8">

          <h2 className="font-semibold mb-4">
            Program Preview / Console
          </h2>

          <iframe
            title="MiniOS Application Output"
            srcDoc={preview}
            sandbox="allow-scripts"
            className="w-full h-96 bg-white border border-gray-700 rounded-xl"
          />

        </div>
      )}

    </div>
  );
}
