
'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  MoveLeftIcon,
  MoveRightIcon
} from 'lucide-react';

export default function Navbar() {

  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    { name: 'File', path: '/minios/files' },
    { name: 'Run', path: '/minios/run' },
    { name: 'Terminal', path: '/minios/terminal' },
    { name: 'Settings', path: '/minios/settings' }
  ];

  return (
    <nav className="flex w-full items-center p-4 gap-5
      shadow bg-gray-600/35 border-b border-gray-700
      text-white sticky top-0 z-50">

      {/* NAVIGATION LINKS */}
      {navigation.map((item) => (

        <button
          key={item.name}
          onClick={() => router.push(item.path)}
          className={`hover:text-green-400 transition-colors
            ${
              pathname === item.path
                ? 'text-green-400 font-bold'
                : 'text-white'
            }`}
        >
          {item.name}
        </button>

      ))}

      {/* BACK AND FORWARD */}
      <div className="flex items-center gap-3 ml-auto">

        <button
          onClick={() => router.back()}
          title="Go back"
          className="hover:text-green-400"
        >
          <MoveLeftIcon size={20} />
        </button>

        <button
          onClick={() => router.forward()}
          title="Go forward"
          className="hover:text-green-400"
        >
          <MoveRightIcon size={20} />
        </button>

      </div>

    </nav>
  );
}
