/**
 * Authentication Utility
 * Handles user authentication with Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

// Create Supabase client
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c4099df5/auth`;

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  storeId?: string;
  accessToken?: string;
  error?: string;
}

/**
 * Sign up a new user
 */
export async function signUp(params: {
  email: string;
  password: string;
  name: string;
  storeName?: string;
  phone?: string;
}): Promise<AuthResponse> {
  try {
    // Prepare params with defaults
    const signupData = {
      email: params.email,
      password: params.password,
      name: params.name,
      storeName: params.storeName || 'My Store',
      phone: params.phone || '',
    };

    // Call backend to create user
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(signupData),
    });

    // Check if response is OK
    if (!response.ok) {
      const text = await response.text();
      console.error('Signup failed with status:', response.status, text);
      
      // Try to parse as JSON if possible
      try {
        const errorData = JSON.parse(text);
        return {
          success: false,
          error: errorData.error || `Server error: ${response.status}`,
        };
      } catch {
        return {
          success: false,
          error: `Server error: ${response.status} - ${text.substring(0, 100)}`,
        };
      }
    }

    // Get response text first
    const responseText = await response.text();
    console.log('Signup response:', responseText);

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response:', responseText);
      return {
        success: false,
        error: `Invalid server response: ${responseText.substring(0, 100)}`,
      };
    }

    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Signup failed',
      };
    }

    // Now sign in the user to get access token
    const signInResult = await signIn({
      email: params.email,
      password: params.password,
    });

    return signInResult;
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(params: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    // Use Supabase client to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.session || !data.user) {
      return {
        success: false,
        error: 'Login failed',
      };
    }

    // Get user info and store ID from backend
    const infoResponse = await fetch(`${API_BASE_URL}/login-info`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${data.session.access_token}`,
      },
    });

    const info = await infoResponse.json();

    if (!info.success) {
      return {
        success: false,
        error: info.error || 'Failed to get user info',
      };
    }

    // Store session data
    localStorage.setItem('accessToken', data.session.access_token);
    localStorage.setItem('refreshToken', data.session.refresh_token || '');
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('storeId', info.data.storeId);
    localStorage.setItem('userEmail', data.user.email || '');
    localStorage.setItem('userName', info.data.user.name || '');

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || '',
        name: info.data.user.name || '',
        phone: info.data.user.phone,
      },
      storeId: info.data.storeId,
      accessToken: data.session.access_token,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
    
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('storeId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    console.log('✅ Signed out successfully');
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

/**
 * Get current session
 */
export async function getSession(): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      return {
        success: false,
        error: 'No active session',
      };
    }

    // Get user info
    const infoResponse = await fetch(`${API_BASE_URL}/login-info`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${data.session.access_token}`,
      },
    });

    const info = await infoResponse.json();

    if (!info.success) {
      return {
        success: false,
        error: 'Session invalid',
      };
    }

    return {
      success: true,
      user: {
        id: info.data.user.id,
        email: info.data.user.email,
        name: info.data.user.name,
        phone: info.data.user.phone,
      },
      storeId: info.data.storeId,
      accessToken: data.session.access_token,
    };
  } catch (error) {
    console.error('Get session error:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('accessToken');
  return !!token;
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  const userId = localStorage.getItem('userId');
  const email = localStorage.getItem('userEmail');
  const name = localStorage.getItem('userName');

  if (!userId || !email) {
    return null;
  }

  return {
    id: userId,
    email,
    name: name || email.split('@')[0],
  };
}

/**
 * Get current store ID
 */
export function getStoreId(): string {
  let storeId = localStorage.getItem('storeId');
  
  // Fallback to legacy storeId if exists
  if (!storeId) {
    storeId = localStorage.getItem('storeId') || `store_${Date.now()}`;
    localStorage.setItem('storeId', storeId);
  }
  
  return storeId;
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

// Convenience aliases for common operations
export const signup = signUp;
export const login = signIn;
export const logout = signOut;

/**
 * Request password reset
 */
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Update user profile
 */
export async function updateProfile(params: {
  name?: string;
  phone?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getAccessToken();
    if (!token) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    
    if (data.success) {
      // Update localStorage
      if (params.name) {
        localStorage.setItem('userName', params.name);
      }
    }
    
    return data;
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
}