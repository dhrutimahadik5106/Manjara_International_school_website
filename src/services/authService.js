import { supabase } from './supabase';

const invalid = () => new Error('Invalid username or password.');
export const authService = {
  async signIn(identifier, password) {
    const value = identifier.trim();
    // Preserve existing administrator/principal email authentication.
    // AuthContext verifies the returned role before granting portal access.
    if (value.includes('@')) return supabase.auth.signInWithPassword({ email: value, password });
    const { data, error } = await supabase.functions.invoke('portal-login', { body: { username: value, password } });
    if (error || !data?.access_token || !data?.refresh_token) throw invalid();
    return supabase.auth.setSession({ access_token: data.access_token, refresh_token: data.refresh_token });
  },
  async changeTemporaryPassword(currentPassword, newPassword) {
    const { data, error } = await supabase.functions.invoke('change-portal-password', { body: { currentPassword, newPassword } });
    if (error || !data?.access_token || !data?.refresh_token) throw new Error('Unable to change your password. Check your current password and retry. If it was reset again, sign in with the latest credentials.');
    const response = await supabase.auth.setSession({ access_token: data.access_token, refresh_token: data.refresh_token });
    if (response.error) throw new Error('Your password was changed. Please sign in again.');
    return response.data.session;
  },
};
