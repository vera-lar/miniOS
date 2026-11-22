
'use client';

import { useState, useRef, useEffect } from 'react';

export default function TerminalPage() {

  const [command, setCommand] = useState('');

  const [history, setHistory] = useState<string[]>([
    'MiniOS Terminal [Version 1.0.0]',
    'Copyright MiniOS.',
    'Type help to see available commands.',
    ''
  ]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop =
        terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (e: React.FormEvent) => {
    e.preventDefault();

    const input = command.trim();

    if (!input) return;

    const [cmd, ...args] = input.split(' ');
    const argument = args.join(' ');

    let result = '';

    switch (cmd.toLowerCase()) {

      case 'help':
        result = `
Available Commands:

help       - Show available commands
clear      - Clear terminal
date       - Show current date
time       - Show current time
whoami     - Show current user
ls         - List directories
about      - About MiniOS
version    - Show system version
echo       - Display a message
`;
        break;

      case 'date':
        result = new Date().toDateString();
        break;

      case 'time':
        result = new Date().toLocaleTimeString();
        break;

      case 'whoami':
        result = 'root';
        break;

      case 'ls':
        result = 'Desktop  Documents  Downloads  System';
        break;

      case 'about':
        result = 'MiniOS is a lightweight browser-based operating system.';
        break;

      case 'version':
        result = 'MiniOS v1.0.0';
        break;

      case 'echo':
        result = argument;
        break;

      case 'clear':
        setHistory([]);
        setCommand('');
        return;

      default:
        result = `Command not recognized: ${cmd}. Type help for commands.`;
    }

    setHistory(prev => [
      ...prev,
      `root@minios:~$ ${input}`,
      result,
      ''
    ]);

    setCommand('');
  };

  return (
    <div
      className="flex flex-col h-full min-h-0
      bg-black text-green-400 font-mono"
    >

      {/* TERMINAL HEADER */}
      <div className="p-4 bg-gray-900
        border-b border-gray-800">

        <h1 className="text-green-400 font-bold">
          MiniOS Terminal
        </h1>

        <p className="text-xs text-gray-400 mt-1">
          root@minios
        </p>

      </div>

      {/* TERMINAL BODY */}
      <div
        ref={terminalRef}
        onClick={() => inputRef.current?.focus()}
        className="flex-1 min-h-0 overflow-y-auto p-5"
      >

        {history.map((line, index) => (

          <pre
            key={index}
            className="whitespace-pre-wrap text-sm mb-2"
          >
            {line}
          </pre>

        ))}

        {/* COMMAND INPUT */}
        <form
          onSubmit={executeCommand}
          className="flex items-center gap-2"
        >

          <span className="text-green-500 shrink-0">
            root@minios:~$
          </span>

          <input
            ref={inputRef}
            autoFocus
            value={command}
            onChange={e => setCommand(e.target.value)}
            className="flex-1 bg-transparent outline-none
            text-white caret-green-400 min-w-0"
            placeholder="Enter command..."
            autoComplete="off"
            spellCheck={false}
          />

        </form>

      </div>

      {/* TERMINAL FOOTER */}
      <div className="bg-gray-900 border-t
        border-gray-800 p-2 text-xs
        flex justify-between">

        <span className="text-gray-400">
          MiniOS Shell
        </span>

        <span className="text-green-400">
          ONLINE
        </span>

      </div>

    </div>
  );
}
