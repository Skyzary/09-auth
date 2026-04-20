'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/store/authStore';
import { checkSession, getMe } from '../../lib/api/clientApi';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      setIsChecking(true);
      try {
        const isAuth = await checkSession();
        if (isAuth) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch (err) {
        clearIsAuthenticated();
      } finally {
        setIsChecking(false);
      }
    };
    checkUserSession();
  }, [pathname, setUser, clearIsAuthenticated]);

  const isPrivateRoute = pathname.startsWith('/profile') || pathname.startsWith('/notes');
  const userIsAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isChecking) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>Loading session...</div>;
  }

  // Fallback protection if proxy lets it through but session is invalid
  if (isPrivateRoute && !userIsAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push('/sign-in');
    }
    return null;
  }

  return <>{children}</>;
}
