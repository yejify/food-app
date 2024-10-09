import { ReactNode } from 'react';
import NavBar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='layout'>
      <NavBar />
      {children}
    </div>
  );
}
