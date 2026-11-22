'use client';

import Link from 'next/link';
import { Home, Folder, Settings, Terminal } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-950 text-white p-5">
      <h2 className="text-xl font-bold mb-8">MiniOS</h2>

      <nav className="space-y-4">
        <Link href="/minios" className="flex items-center gap-3 hover:text-blue-400">
          <Home size={20} />
          Desktop
        </Link>

        <Link href="/minios/files" className="flex items-center gap-3 hover:text-blue-400">
          <Folder size={20} />
          Files
        </Link>

        <Link href="/minios/terminal" className="flex items-center gap-3 hover:text-blue-400">
          <Terminal size={20} />
          Terminal
        </Link>

        <Link href="/minios/settings" className="flex items-center gap-3 hover:text-blue-400">
          <Settings size={20} />
          Settings
        </Link>
      </nav>
    </aside>
  );
}