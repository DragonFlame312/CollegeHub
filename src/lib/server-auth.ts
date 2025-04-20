'use server';

import { getDatabase } from './database-interface';
import { cookies } from 'next/headers';
import { User } from '@/app/forum/page';

/**
 * Gets the current authenticated user from the session token in cookies
 */
export async function getServerAuthUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return null;
    }

    const db = getDatabase();
    const user = await db.getCurrentUser(sessionToken);

    return user;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

/**
 * Server-side login function
 */
export async function serverLogin(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const db = getDatabase();
    const user = await db.login(email, password);

    // Set the session cookie
    cookies().set('session_token', user.sessionToken as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return { success: true, message: 'Logged in successfully', user };
  } catch (error: any) {
    return { success: false, message: error.message || 'Login failed' };
  }
}

/**
 * Server-side login with college ID
 */
export async function serverLoginWithCollegeId(collegeId: string, pin: string): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const db = getDatabase();
    const user = await db.loginWithCollegeId(collegeId, pin);

    // Set the session cookie
    cookies().set('session_token', user.sessionToken as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return { success: true, message: 'Logged in successfully', user };
  } catch (error: any) {
    return { success: false, message: error.message || 'Login failed' };
  }
}

/**
 * Server-side register function
 */
export async function serverRegister(name: string, email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const db = getDatabase();
    const user = await db.register(name, email, password);

    // Set the session cookie
    cookies().set('session_token', user.sessionToken as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return { success: true, message: 'Registered successfully', user };
  } catch (error: any) {
    return { success: false, message: error.message || 'Registration failed' };
  }
}

/**
 * Server-side logout function
 */
export async function serverLogout(): Promise<{ success: boolean; message: string }> {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (sessionToken) {
      const db = getDatabase();
      await db.logout(sessionToken);
    }

    // Delete the session cookie
    cookies().delete('session_token');

    return { success: true, message: 'Logged out successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Logout failed' };
  }
}

/**
 * Server-side function to update user profile
 */
export async function serverUpdateProfile(data: Partial<User>): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const user = await getServerAuthUser();

    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    const db = getDatabase();
    const updatedUser = await db.updateUserProfile(user.id, data);

    return { success: true, message: 'Profile updated successfully', user: updatedUser };
  } catch (error: any) {
    return { success: false, message: error.message || 'Profile update failed' };
  }
}
