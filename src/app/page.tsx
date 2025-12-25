import Image from "next/image";
import { redirect } from 'next/navigation';

// Redirect from the default Next.js page to the homepage
export default function Home() {
  redirect('/homepage');
}
