
'use client';

import { useState, useEffect, useRef } from 'react';

import Navbar from '../../navbar/page';

const MemoryManager = () => {

  const [isBooting, setIsBooting] = useState(true);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Welcome to MiniOS Terminal.',
    'System initialized successfully.',
    'Type "help" to see available commands.',
    ''
  ]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // BOOT PROCESS
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // AUTO SCROLL
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop =
        terminalRef.current.scrollHeight;
    }
  }, [history]);

  // TERMINAL COMMANDS
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();

    const cmd = command.trim().toLowerCase();

    if (!cmd) return;

    let result = '';

    switch (cmd) {

      case 'help':
        result = `Available commands:

help       - Show available commands
clear      - Clear terminal
date       - Display current date
time       - Display current time
whoami     - Show current user
about      - About MiniOS
ls         - List files
version    - Show system version
reboot     - Restart MiniOS`;

        break;

      case 'clear':
        setHistory([]);
        setCommand('');
        return;

      case 'date':
        result = new Date().toDateString();
        break;

      case 'time':
        result = new Date().toLocaleTimeString();
        break;

      case 'whoami':
        result = 'root';
        break;

      case 'about':
        result = 'MiniOS - A simple browser-based operating system.';
        break;

      case 'ls':
        result = 'Desktop/  Documents/  Downloads/  System/';
        break;

      case 'version':
        result = 'MiniOS version 1.0.0';
        break;

      case 'reboot':
        setIsBooting(true);
        setCommand('');
        setHistory([]);
        setTimeout(() => setIsBooting(false), 3000);
        return;

      default:
        result = `Command not found: ${cmd}. Type "help" for available commands.`;
    }

    setHistory(prev => [
      ...prev,
      `root@minios:~$ ${command}`,
      result,
      ''
    ]);

    setCommand('');
  };

  // BOOT SCREEN
  if (isBooting) {
    return (
      <div className="flex flex-col justify-center items-center
        h-screen w-full bg-black text-green-400 font-mono">

        <h1 className="text-4xl font-bold mb-6">
          MiniOS
        </h1>

        <p className="text-sm mb-4">
          Initializing MiniOS...
        </p>

        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 animate-pulse w-full" />
        </div>

        <p className="text-xs text-gray-500 mt-5">
          Loading system components...
        </p>

      </div>
    );
  }

  // MAIN MINIOS INTERFACE
  return (
    <div className="flex h-screen w-full bg-black overflow-hidden">

  

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* NAVBAR */}
        <Navbar />

        {/* TERMINAL */}
        <div className="flex flex-col flex-1 min-h-0 bg-black">

          {/* TERMINAL HEADER */}
          <div className="flex items-center justify-between
            bg-gray-900 border-b border-gray-700 px-5 py-3">

            <h2 className="text-green-400 font-mono text-sm">
              MiniOS Terminal
            </h2>

            <span className="text-gray-400 text-xs">
              root@minios
            </span>

          </div>

          {/* TERMINAL OUTPUT */}
          <div
            ref={terminalRef}
            onClick={() => inputRef.current?.focus()}
            className="flex-1 overflow-y-auto p-5
            text-green-400 font-mono text-sm"
          >

            {history.map((line, index) => (
              <pre
                key={index}
                className="whitespace-pre-wrap mb-2"
              >
                {line}
              </pre>
            ))}

            {/* COMMAND INPUT */}
            <form
              onSubmit={handleCommand}
              className="flex items-center gap-2"
            >

              <span className="text-green-500 shrink-0">
                root@minios:~$
              </span>

              <input
                ref={inputRef}
                autoFocus
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="flex-1 bg-transparent text-white
                outline-none caret-green-400"
                placeholder="Enter command..."
                autoComplete="off"
                spellCheck={false}
              />

            </form>

          </div>

          {/* TERMINAL FOOTER */}
          <div className="flex justify-between items-center
            bg-gray-900 border-t border-gray-800 px-5 py-2">

            <span className="text-gray-400 text-xs">
              MiniOS Terminal
            </span>

            <span className="text-green-500 text-xs">
              SYSTEM ONLINE
            </span>

          </div>

        </div>
      </div>
    </div>
  );
};

export default MemoryManager;
