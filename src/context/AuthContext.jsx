
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { supabase } from '../services/supabase';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const allowedRoles = new Set([
  'admin',
  'principal',
  'teacher',
  'student',
  'parent',
]);

async function loadProfile(authUser) {
  if (!authUser) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id,email,username,full_name,role,avatar_url,is_active,must_change_password,phone_number'
    )
    .eq('id', authUser.id)
    .single();

  if (error || !data) {
    throw new Error(
      'Unable to verify your school account. Contact the administrator.'
    );
  }

  if (data.is_active !== true) {
    throw new Error(
      'This account is inactive. Contact the school administrator.'
    );
  }

  if (!allowedRoles.has(data.role)) {
    throw new Error(
      'This account is not authorized to access the school portal.'
    );
  }

  return {
    id: authUser.id,
    email: data.email || authUser.email,
    username: data.username,
    fullName: data.full_name,
    role: data.role,
    avatar: data.avatar_url,
    phone: data.phone_number,
    mustChangePassword: Boolean(data.must_change_password),
    details: data,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const revisionRef = useRef(0);

  useEffect(() => {
    let active = true;

    const restore = async () => {
      const current = ++revisionRef.current;

      try {
        const { data, error } = await supabase.auth.getUser();

        if (error && error.name !== 'AuthSessionMissingError') {
          throw error;
        }

        const profile = data?.user
          ? await loadProfile(data.user)
          : null;

        if (active && current === revisionRef.current) {
          setUser(profile);
          setAuthError(null);
        }
      } catch (error) {
        if (active && current === revisionRef.current) {
          setUser(null);
          setAuthError(
            error.message || 'Unable to restore your session.'
          );
        }
      } finally {
        if (active && current === revisionRef.current) {
          setLoading(false);
        }
      }
    };

    restore();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === 'SIGNED_OUT' ||
        event === 'USER_DELETED'
      ) {
        revisionRef.current += 1;

        if (active) {
          setUser(null);
          setAuthError(null);
          setLoading(false);
        }
      } else if (
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED'
      ) {
        // Avoid making Supabase requests synchronously
        // inside the authentication callback.
        setTimeout(() => {
          if (active) restore();
        }, 0);
      }
    });

    return () => {
      active = false;
      revisionRef.current += 1;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (identifier, password) => {
    setAuthError(null);
    setLoading(true);

    try {
      const { data, error } = await authService.signIn(
        identifier,
        password
      );

      if (error) throw error;

      if (!data?.user) {
        throw new Error('Unable to verify your login.');
      }

      const profile = await loadProfile(data.user);

      setUser(profile);
      setAuthError(null);

      return {
        success: true,
        user: profile,
      };
    } catch (error) {
      await supabase.auth.signOut();

      setUser(null);

      const message =
        error.message || 'Unable to sign in.';

      setAuthError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    currentPassword,
    newPassword
  ) => {
    await authService.changeTemporaryPassword(
      currentPassword,
      newPassword
    );

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      throw new Error('Please sign in again.');
    }

    const profile = await loadProfile(data.user);

    setUser(profile);
    setAuthError(null);

    return profile;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    revisionRef.current += 1;
    setUser(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        logout,
        changePassword,
        isAuthenticated: Boolean(user),
        role: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};

export default AuthContext;
