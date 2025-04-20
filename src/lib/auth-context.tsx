"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/app/forum/page";
import { useRouter } from "next/navigation";
import { getDatabase } from "./database-interface";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithCollegeId: (collegeId: string, pin: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const db = getDatabase();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const sessionToken = getCookie("session_token") as string;

        if (sessionToken) {
          const currentUser = await db.getCurrentUser(sessionToken);
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = await db.login(email, password);

      if (loggedInUser.sessionToken) {
        setCookie("session_token", loggedInUser.sessionToken, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
        });
      }

      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Login with college ID function
  const loginWithCollegeId = async (collegeId: string, pin: string) => {
    try {
      const loggedInUser = await db.loginWithCollegeId(collegeId, pin);

      if (loggedInUser.sessionToken) {
        setCookie("session_token", loggedInUser.sessionToken, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
        });
      }

      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error("Login with college ID error:", error);
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      const registeredUser = await db.register(name, email, password);

      if (registeredUser.sessionToken) {
        setCookie("session_token", registeredUser.sessionToken, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
        });
      }

      setUser(registeredUser);
      return registeredUser;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const sessionToken = getCookie("session_token") as string;

      if (sessionToken) {
        await db.logout(sessionToken);
        deleteCookie("session_token");
      }

      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User>) => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      const updatedUser = await db.updateUserProfile(user.id, data);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithCollegeId,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
