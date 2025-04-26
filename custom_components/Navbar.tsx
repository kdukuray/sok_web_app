import { createClient } from '@/utils/supabase/server'
import NavbarClient from './NavbarClient'

export default async function Navbar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isLoggedIn = !!data.user;

  return <NavbarClient isLoggedIn={isLoggedIn} />
}
