import Image from 'next/image';
import Link from 'next/link';
import { ConnectButton } from "thirdweb/react";
import { client } from '@/app/client';
const Header = () => {

  return (
    <header className="bg-gradient-to-r from-purple-900 to-purple-500 text-white p-4 font-inter">
      <div className="container mx-auto flex justify-between items-center">
          <Image src="/images/logo.png" alt="BTFD.WTF Logo" width={200} height={50} className="rounded-full" />
        
        <nav className="hidden lg:flex space-x-8 text-lg">
          <Link href="/buy-sell" className="hover:text-purple-200 transition-colors">Buy / Sell</Link>
          <Link href="/grow" className="hover:text-purple-200 transition-colors">Grow</Link>
          <Link href="/markets" className="hover:text-purple-200 transition-colors">Markets</Link>
          <Link href="/business" className="hover:text-purple-200 transition-colors">Business</Link>
          <Link href="/support" className="hover:text-purple-200 transition-colors">Support</Link>
        </nav>
        
        <div className="flex space-x-3">
          
        <ConnectButton client={client} />;
        </div>
      </div>
    </header>
  );
};

export default Header;