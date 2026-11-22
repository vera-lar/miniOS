
'use client';

import { useState } from 'react';
import { Monitor, Volume2, Moon, Info } from 'lucide-react';

export default function SettingsPage() {

  const [darkMode, setDarkMode] = useState(true);
  const [sound, setSound] = useState(true);
  const [animations, setAnimations] = useState(true);

  const settings = [
    {
      name: 'Dark Mode',
      description: 'Use the dark MiniOS appearance.',
      icon: Moon,
      value: darkMode,
      change: setDarkMode
    },
    {
      name: 'System Sound',
      description: 'Enable system sound effects.',
      icon: Volume2,
      value: sound,
      change: setSound
    },
    {
      name: 'Animations',
      description: 'Enable interface animations.',
      icon: Monitor,
      value: animations,
      change: setAnimations
    }
  ];

  return (
    <div className="min-h-full bg-gray-950 text-white p-6">

      <h1 className="text-2xl font-bold text-green-400">
        System Settings
      </h1>

      <p className="text-gray-400 mt-2">
        Configure your MiniOS environment.
      </p>

      <div className="mt-8 space-y-4">

        {settings.map(item => {

          const Icon = item.icon;

          return (
            <div key={item.name}
              className="flex items-center justify-between
              bg-gray-900 border border-gray-800
              rounded-lg p-5">

              <div className="flex gap-4 items-center">

                <Icon className="text-green-400" />

                <div>
                  <h2 className="font-semibold">
                    {item.name}
                  </h2>

                  <p className="text-gray-400 text-sm">
                    {item.description}
                  </p>
                </div>

              </div>

              <button
                onClick={() => item.change(!item.value)}
                className={`w-12 h-6 rounded-full p-1
                transition-colors ${
                  item.value ? 'bg-green-500' : 'bg-gray-600'
                }`}
                aria-label={`Toggle ${item.name}`}
                aria-pressed={item.value}
              >
                <span className={`block w-4 h-4 bg-white
                  rounded-full transition-transform ${
                    item.value ? 'translate-x-6' : 'translate-x-0'
                  }`} />
              </button>

            </div>
          );
        })}

      </div>

      <div className="mt-8 bg-gray-900 p-5 rounded-lg
        border border-gray-800">

        <div className="flex gap-3 items-center">
          <Info className="text-blue-400" />

          <h2 className="font-semibold">About MiniOS</h2>
        </div>

        <p className="text-gray-400 mt-3 text-sm">
          MiniOS version 1.0.0
        </p>

        <p className="text-gray-400 text-sm">
          A lightweight browser-based operating system.
        </p>

      </div>

    </div>
  );
}
