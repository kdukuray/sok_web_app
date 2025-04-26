import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import FooterClient from './FooterClient'  // import the client component

export default async function Footer() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isLoggedIn = !!data.user;

  return (
    <footer className="bg-blue-950 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* About Section */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold border-b border-white pb-2">Seekers of Knowledge</h4>
          <p className="text-gray-300">
            Seekers of Knowledge is a community initiative based at Masjid Sidiki in the Bronx, NY. We aim to teach Islamic sciences such as Tawheed, Fiqh, Hadith, and Tafsir, empowering the next generation to worship Allah as He should be worshiped.
          </p>
        </div>

        {/* Report Issues */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold border-b border-white pb-2">Report Issues</h4>
          <ul className="space-y-2 text-gray-300">
            <li>Email: <a href="mailto:sotheknowledge.com" className="underline hover:text-gray-100">sotheknowledge.com</a></li>
            <li><a href="https://github.com/kdukuray/sok_web_app" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-100">Contribute on GitHub</a></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold border-b border-white pb-2">Useful Links</h4>
          <FooterClient isLoggedIn={isLoggedIn} /> {/* <-- using client component */}
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold border-b border-white pb-2">Contact</h4>
          <ul className="space-y-2 text-gray-300">
            <li>📍 1462 Boston Rd, Bronx, NY 10459</li>
            <li>✉️ sotheknowledge.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Seekers of Knowledge. All rights reserved.
      </div>
    </footer>
  )
}
