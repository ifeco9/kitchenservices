import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSignUp = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();
const mockGetUser = vi.fn();
const mockResetPasswordForEmail = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
      getSession: mockGetSession,
      getUser: mockGetUser,
      resetPasswordForEmail: mockResetPasswordForEmail,
      updateUser: mockUpdateUser,
    },
  }),
}));

const { authService } = await import('../authService');

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('throws on invalid email format', async () => {
      await expect(authService.signUp('notanemail', 'password123', 'Test User'))
        .rejects.toThrow('Invalid email format');
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    it('throws on short password', async () => {
      await expect(authService.signUp('test@test.com', '123', 'Test User'))
        .rejects.toThrow('Password must be at least 8 characters');
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    it('throws on empty full name', async () => {
      await expect(authService.signUp('test@test.com', 'password123', ''))
        .rejects.toThrow('Full name is required');
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    it('throws on whitespace-only full name', async () => {
      await expect(authService.signUp('test@test.com', 'password123', '   '))
        .rejects.toThrow('Full name is required');
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    it('calls supabase signUp with valid data', async () => {
      const mockData = { user: { id: '123' }, session: { access_token: 'token' } };
      mockSignUp.mockResolvedValue({ data: mockData, error: null });

      const result = await authService.signUp('test@test.com', 'password123', 'Test User');
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
        options: { data: { full_name: 'Test User' } },
      });
      expect(result).toEqual(mockData);
    });

    it('passes role to signUp when provided', async () => {
      const mockData = { user: { id: '123' }, session: { access_token: 'token' } };
      mockSignUp.mockResolvedValue({ data: mockData, error: null });

      await authService.signUp('tech@test.com', 'password123', 'Tech User', 'technician');
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'tech@test.com',
        password: 'password123',
        options: { data: { full_name: 'Tech User', role: 'technician' } },
      });
    });

    it('throws on supabase error', async () => {
      mockSignUp.mockResolvedValue({ data: null, error: { message: 'User already exists' } });
      await expect(authService.signUp('test@test.com', 'password123', 'Test User'))
        .rejects.toThrow('User already exists');
    });
  });

  describe('signIn', () => {
    it('throws on missing email', async () => {
      await expect(authService.signIn('', 'password123'))
        .rejects.toThrow('Email and password are required');
    });

    it('throws on missing password', async () => {
      await expect(authService.signIn('test@test.com', ''))
        .rejects.toThrow('Email and password are required');
    });

    it('calls supabase signInWithPassword with valid credentials', async () => {
      const mockData = { user: { id: '123' }, session: { access_token: 'token' } };
      mockSignInWithPassword.mockResolvedValue({ data: mockData, error: null });

      const result = await authService.signIn('test@test.com', 'password123');
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('signOut', () => {
    it('calls supabase signOut', async () => {
      mockSignOut.mockResolvedValue({ error: null });
      await authService.signOut();
      expect(mockSignOut).toHaveBeenCalled();
    });

    it('throws on supabase error', async () => {
      mockSignOut.mockResolvedValue({ error: { message: 'Sign out failed' } });
      await expect(authService.signOut()).rejects.toThrow('Sign out failed');
    });
  });

  describe('resetPasswordRequest', () => {
    it('throws on invalid email', async () => {
      await expect(authService.resetPasswordRequest('notanemail'))
        .rejects.toThrow('Invalid email format');
    });

    it('calls supabase resetPasswordForEmail with valid email', async () => {
      mockResetPasswordForEmail.mockResolvedValue({ error: null });
      await authService.resetPasswordRequest('test@test.com');
      expect(mockResetPasswordForEmail).toHaveBeenCalledWith('test@test.com', {
        redirectTo: expect.stringContaining('/auth/reset-password'),
      });
    });
  });

  describe('updatePassword', () => {
    it('throws on short password', async () => {
      await expect(authService.updatePassword('short'))
        .rejects.toThrow('Password must be at least 8 characters');
    });

    it('calls supabase updateUser with valid password', async () => {
      mockUpdateUser.mockResolvedValue({ error: null });
      await authService.updatePassword('newpassword123');
      expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'newpassword123' });
    });
  });
});
