
'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Cpu,
  HardDrive,
  MemoryStick,
  ShieldCheck,
  Monitor,
  CheckCircle2,
  LoaderCircle,
} from 'lucide-react';

import Navbar from '../navbar/page';

const bootSteps = [
  { name: 'Power-on self-test (POST)', at: 12, icon: ShieldCheck },
  { name: 'Initializing CPU...', at: 28, icon: Cpu },
  { name: 'Checking system memory...', at: 45, icon: MemoryStick },
  { name: 'Detecting storage devices...', at: 60, icon: HardDrive },
  { name: 'Loading MiniOS kernel...', at: 77, icon: Cpu },
  { name: 'Starting system services...', at: 90, icon: ShieldCheck },
  { name: 'Initializing desktop environment...', at: 100, icon: Monitor },
];

export default function MiniOSLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [progress, setProgress] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((previous) => {
        if (previous >= 100) {
          window.clearInterval(timer);
          return 100;
        }

        return Math.min(previous + 1, 100);
      });
    }, 45);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = window.setTimeout(() => {
        setBootComplete(true);
      }, 800);

      return () => window.clearTimeout(timeout);
    }
  }, [progress]);

  // BOOT SCREEN
  if (!bootComplete) {
    return (
      <div className="h-screen w-full bg-[#050914] text-white flex flex-col items-center justify-center p-6">

        <div className="w-full max-w-xl">

          <div className="text-center mb-10">
            <div className="mx-auto mb-5 flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/40">
              <Monitor size={42} className="text-blue-400" />
            </div>

            <h1 className="text-4xl font-bold tracking-widest">
              MiniOS
            </h1>

            <p className="text-gray-400 mt-2">
              Mini Operating System
            </p>
          </div>

          <div className="bg-black/60 border border-gray-800 rounded-xl p-6 shadow-2xl">

            <div className="flex justify-between mb-5">
              <span className="text-sm text-blue-400 font-mono">
                SYSTEM BOOTING...
              </span>

              <span className="text-sm text-green-400 font-mono">
                {progress}%
              </span>
            </div>

            <div className="w-full bg-gray-800 rounded-full h-2 mb-7 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="space-y-4 font-mono text-sm">

              {bootSteps.map((step, index) => {
                const completed = progress >= step.at;
                const current =
                  !completed &&
                  (index === 0 || progress >= bootSteps[index - 1].at);

                const Icon = step.icon;

                return (
                  <div
                    key={step.name}
                    className={`flex items-center gap-3 ${
                      completed
                        ? 'text-green-400'
                        : current
                        ? 'text-blue-400'
                        : 'text-gray-600'
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 size={17} />
                    ) : current ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <Icon size={17} />
                    )}

                    <span>{step.name}</span>

                    {completed && (
                      <span className="ml-auto text-xs">OK</span>
                    )}
                  </div>
                );
              })}

            </div>
          </div>

          <p className="text-center text-gray-500 text-xs mt-8">
            MiniOS Boot Manager | Version 1.0.0
          </p>

          <p className="text-center text-blue-400 text-xs mt-2 animate-pulse">
            Please wait while the operating system initializes...
          </p>

        </div>
      </div>
    );
  }

  // DESKTOP APPEARS ONLY AFTER BOOT
  return (
    <div className="flex flex-col h-screen w-full bg-black text-white overflow-hidden">
      <Navbar />

      <main className="flex-1 min-h-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
