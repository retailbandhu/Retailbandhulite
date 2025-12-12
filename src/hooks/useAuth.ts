import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

export interface Store {
  id: number;
  userId: string | null;
  name: string;
  owner: string;
  address: string | null;
  phone: string | null;
  logo: string | null;
  billColor: string | null;
  gstin: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/user', {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        await fetchStore();
      } else {
        setUser(null);
        setStore(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchStore = async () => {
    try {
      const response = await fetch('/api/my-store', {
        credentials: 'include',
      });
      if (response.ok) {
        const storeData = await response.json();
        setStore(storeData);
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    }
  };

  const login = () => {
    window.location.href = '/api/login';
  };

  const logout = () => {
    window.location.href = '/api/logout';
  };

  return { user, store, loading, login, logout, refetch: fetchUser };
}
