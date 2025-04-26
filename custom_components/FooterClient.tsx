"use client";  // This makes it a Client Component

import Link from 'next/link';
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

type FooterClientProps = {
  isLoggedIn: boolean;
};

export default function FooterClient({ isLoggedIn }: FooterClientProps) {
  const router = useRouter();
  const supabase = createPagesBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // better than window.location.reload()
  };

  return (
    <ul className="space-y-2">
      <li><Link href="/" className="hover:text-gray-300 transition-colors">Home</Link></li>
      <li><Link href="/about" className="hover:text-gray-300 transition-colors">About</Link></li>
      <li><Link href="/lessons/1" className="hover:text-gray-300 transition-colors">Lessons</Link></li>
      <li><Link href="/announcements/1" className="hover:text-gray-300 transition-colors">Announcements</Link></li>
      <li>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="hover:text-gray-300 transition-colors underline cursor-pointer">
            Logout
          </button>
        ) : (
          <Link href="/login" className="hover:text-gray-300 transition-colors">Login</Link>
        )}
      </li>
    </ul>
  );
}
