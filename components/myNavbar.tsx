'use client';
import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

import { useEffect, useState } from 'react';
import { auth, firebaseApp, logOut } from '@/services/llm/firebase';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LanguageToggle from '@/components/languageToggle'; // Import the LanguageToggle component

export function MyNavbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
  }, []);

  return (
    <div className='relative z-50 w-full border-b border-gray-300'>
      <NavigationMenu>
        <NavigationMenuList>
          <div className='flex items-center justify-between p-4 w-full'>
            <Link href='/'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <Image src='/images/logo1.png' alt='Logo' width={100} height={40} />
                </div>
                <div className='ml-4'>
                  <h1 className='text-xl md:text-3xl text-slate-950 font-bold'>SmartInsulation</h1>
                </div>
              </div>
            </Link>
            <div className='block md:hidden ml-4'>
              <button onClick={toggleMobileMenu} className='text-gray-700 focus:outline-none'>
                <svg
                  className='w-6 h-6 ml-28 sm:ml-6 mt-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16m-7 6h7' />
                </svg>
              </button>
            </div>
            <div className='hidden md:flex items-center space-x-4 ml-8'>
              <NavigationMenuItem>
                <Link href='/how-to-use' legacyBehavior passHref>
                  <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-xl`}>
                    How to use?
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href='/pricing' legacyBehavior passHref>
                  <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-xl`}>Pricing</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href='/contact' legacyBehavior passHref>
                  <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-xl`}>Contact</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {!isSignedIn ? (
                <Link href='/sign-in'>
                  <NavigationMenuItem>
                    <Button variant='outline' className='bg-[#C5ECE0] hover:bg-green-200 text-xl py-2 px-4 square-lg'>
                      Sign in
                    </Button>
                  </NavigationMenuItem>
                </Link>
              ) : (
                <NavigationMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger className='bg-[#C5ECE0] hover:bg-green-200 text-xl py-2 px-4 square-lg rounded-lg'>
                      Logout
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to log out</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            logOut();
                            router.refresh();
                          }}
                          className='bg-[#C5ECE0] hover:bg-green-200 text-black'
                        >
                          Logout
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </NavigationMenuItem>
              )}
              <LanguageToggle /> {/* Move the LanguageToggle component here */}
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className='md:hidden absolute top-16 right-4 w-6/7 bg-white shadow-lg border border-gray-200 rounded-md mt-8'>
              <div className='flex flex-col space-y-2 p-4'>
                <NavigationMenuItem>
                  <Link href='/how-to-use' legacyBehavior passHref>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-lg`}>
                      How to use?
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href='/pricing' legacyBehavior passHref>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-lg`}>
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href='/contact' legacyBehavior passHref>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-lg`}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {!isSignedIn ? (
                  <Link href='/sign-in'>
                    <NavigationMenuItem>
                      <Button variant='outline' className='bg-[#C5ECE0] hover:bg-green-200 text-lg py-2 px-4 square-lg'>
                        Sign in
                      </Button>
                    </NavigationMenuItem>
                  </Link>
                ) : (
                  <NavigationMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger className='bg-[#C5ECE0] hover:bg-green-200 text-lg py-2 px-4 square-lg rounded-lg'>
                        Logout
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>Are you sure you want to log out</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              logOut();
                              router.refresh();
                            }}
                            className='bg-[#C5ECE0] hover:bg-green-200 text-black'
                          >
                            Logout
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </NavigationMenuItem>
                )}
                <LanguageToggle /> {/* Move the LanguageToggle component here for mobile */}
              </div>
            </div>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className='text-sm font-medium leading-none'>{title}</div>
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
export default MyNavbar;
