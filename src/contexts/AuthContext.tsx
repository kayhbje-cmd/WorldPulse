// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData, Role } from '../types';

export interface OtpLoginData {
  phone: string;
  otp: string;
  persona?: 'person1' | 'person2' | 'custom';
  name?: string;
  role?: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOfficer: boolean;
  currentPersona: 'person1' | 'person2' | 'custom';
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithOtp: (data: OtpLoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => void;
  switchPersona: (persona: 'person1' | 'person2') => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

export const PERSON_1_USER: User = {
  id: 'usr-avinash',
  email: 'avinashshinde1542@gmail.com',
  name: 'Avinash Shinde',
  phone: '9876543210',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
  preferred_language: 'en',
  role: 'citizen',
  problems_posted: 1,
  problems_solved: 0,
  is_active: true,
  created_at: '2026-01-01T00:00:00.000Z',
};

export const PERSON_2_USER: User = {
  id: 'usr-officer-rajesh',
  email: 'rajesh.kulkarni@civic.gov.in',
  name: 'Er. Rajesh Kulkarni',
  phone: '9820112345',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
  preferred_language: 'en',
  role: 'officer',
  department_id: 'dept-pwd',
  employee_id: 'MCGM-PWD-4091',
  problems_posted: 0,
  problems_solved: 142,
  is_active: true,
  created_at: '2025-06-01T00:00:00.000Z',
  officers: [
    {
      id: 'off-101',
      department_id: 'dept-pwd',
      department_name: 'Public Works Department',
      designation: 'Executive Engineer (PWD West)',
      is_available: true,
      phone: '+91 98201 12345',
      badge_number: 'PWD-ENG-77',
    },
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPersona, setCurrentPersona] = useState<'person1' | 'person2' | 'custom'>('person1');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('janmitra_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        if (parsed.id === PERSON_2_USER.id) {
          setCurrentPersona('person2');
        } else if (parsed.id === PERSON_1_USER.id) {
          setCurrentPersona('person1');
        } else {
          setCurrentPersona('custom');
        }
      } else {
        // Initialize default citizen (Avinash Shinde / Person 1)
        setUser(PERSON_1_USER);
        setCurrentPersona('person1');
        localStorage.setItem('janmitra_user', JSON.stringify(PERSON_1_USER));
      }
    } catch {
      setUser(PERSON_1_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithOtp = async (data: OtpLoginData) => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'OTP verification failed');
      }

      const resJson = await res.json();
      const authenticatedUser: User = resJson.user;

      setUser(authenticatedUser);
      localStorage.setItem('janmitra_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('auth_token', resJson.token);

      if (authenticatedUser.id === PERSON_2_USER.id) {
        setCurrentPersona('person2');
      } else if (authenticatedUser.id === PERSON_1_USER.id) {
        setCurrentPersona('person1');
      } else {
        setCurrentPersona('custom');
      }
    } catch (err: any) {
      // Offline fallback: if OTP is 1234
      if (data.otp === '1234') {
        const fallbackUser = data.persona === 'person2' ? PERSON_2_USER : PERSON_1_USER;
        setUser(fallbackUser);
        localStorage.setItem('janmitra_user', JSON.stringify(fallbackUser));
        setCurrentPersona(data.persona === 'person2' ? 'person2' : 'person1');
      } else {
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchPersona = (persona: 'person1' | 'person2') => {
    const targetUser = persona === 'person2' ? PERSON_2_USER : PERSON_1_USER;
    setUser(targetUser);
    setCurrentPersona(persona);
    localStorage.setItem('janmitra_user', JSON.stringify(targetUser));
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (credentials.role === 'officer' || credentials.email.includes('officer')) {
      setUser(PERSON_2_USER);
      setCurrentPersona('person2');
      localStorage.setItem('janmitra_user', JSON.stringify(PERSON_2_USER));
    } else {
      setUser(PERSON_1_USER);
      setCurrentPersona('person1');
      localStorage.setItem('janmitra_user', JSON.stringify(PERSON_1_USER));
    }
    setIsLoading(false);
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      email: data.email,
      name: data.name,
      phone: data.phone || '9876543210',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      preferred_language: 'en',
      role: data.role || 'citizen',
      problems_posted: 0,
      problems_solved: 0,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    setCurrentPersona('custom');
    localStorage.setItem('janmitra_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = async () => {
    localStorage.removeItem('janmitra_user');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const switchRole = (role: Role) => {
    if (role === 'officer') {
      switchPersona('person2');
    } else {
      switchPersona('person1');
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('janmitra_user', JSON.stringify(updated));
  };

  const isOfficer = user?.role === 'officer' || user?.role === 'department_head' || user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isOfficer,
        currentPersona,
        login,
        loginWithOtp,
        register,
        logout,
        switchRole,
        switchPersona,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
