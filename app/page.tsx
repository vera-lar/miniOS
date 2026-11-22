'use client';

import { useRouter } from 'next/navigation';
import {
  Folder,
  Terminal,
  Settings,
  Play,
  Monitor,
} from 'lucide-react';

export default function MiniOSHome() {
  const router = useRouter();

  const applications = [
    {
      name: 'Files',
      description: 'Manage your files',
      icon: Folder,
      path: '/minios/files',
    },
    {
      name: 'Terminal',
      description: 'Run MiniOS commands',
      icon: Terminal,
      path: '/minios/terminal',
    },
    {
      name: 'Run',
      description: 'Launch applications',
      icon: Play,
      path: '/minios/run',
    },
    {
      name: 'Settings',
      description: 'Configure MiniOS',
      icon: Settings,
      path: '/minios/settings',
    },
  ];

  return (
    <div className="min-h-full bg-black text-white p-8">

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Monitor size={35} className="text-blue-400" />
          <h1 className="text-3xl font-bold">MiniOS</h1>
        </div>

        <p className="text-gray-400">
          Welcome to your MiniOS desktop.
          Choose an application to get started.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {applications.map((app) => {
          const Icon = app.icon;

          return (
            <button
              key={app.name}
              onClick={() => router.push(app.path)}
              className="flex flex-col items-center gap-3 rounded-xl
              border border-gray-700 bg-gray-900 p-6
              hover:bg-gray-800 hover:border-blue-400
              transition duration-200"
            >
              <Icon size={38} className="text-blue-400" />

              <h2 className="font-semibold">
                {app.name}
              </h2>

              <p className="text-xs text-gray-400 text-center">
                {app.description}
              </p>
            </button>
          );
        })}

      </div>

      <div className="mt-12 border-t border-gray-800 pt-5">
        <p className="text-sm text-gray-500">
          MiniOS © 2026 | Browser-based operating system simulation
        </p>
      </div>

    </div>
  );
}