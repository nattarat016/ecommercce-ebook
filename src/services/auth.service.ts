import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const authService = {
    // ลงทะเบียนผู้ใช้ใหม่
    signUp: async (email: string, password: string, fullName: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        });

        if (error) throw error;
        return data;
    },

    // เข้าสู่ระบบ
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // ดึงข้อมูล profile เพื่อเช็ค admin
        if (data.user) {
            const { data: profileData, error: profileError } = await supabase
                .from('Users')
                .select('is_admin')
                .eq('user_id', data.user.id)
                .single();

            if (profileError) throw profileError;

            return {
                user: data.user,
                isAdmin: profileData?.is_admin || false
            };
        }

        return { user: null, isAdmin: false };
    },

    // ออกจากระบบ
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    // ดึงข้อมูลผู้ใช้ปัจจุบัน
    getCurrentUser: async (): Promise<User | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // ดึงข้อมูล profile ของผู้ใช้
    getUserProfile: async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    // อัพเดทข้อมูล profile
    updateProfile: async (userId: string, updates: {
        full_name?: string;
        avatar_url?: string;
    }) => {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('user_id', userId);

        if (error) throw error;
        return data;
    },

    // เช็คว่าผู้ใช้เป็น admin หรือไม่
    isAdmin: async (userId: string): Promise<boolean> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data?.is_admin || false;
    },

    // ดึงข้อมูล session ปัจจุบัน
    getCurrentSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    },

    // รีเซ็ตรหัสผ่าน
    resetPassword: async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
    },

    // เปลี่ยนรหัสผ่าน
    changePassword: async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
    },

    // ตรวจสอบสถานะการเข้าสู่ระบบ
    onAuthStateChange: (callback: (event: 'SIGNED_IN' | 'SIGNED_OUT', session: any) => void) => {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event as 'SIGNED_IN' | 'SIGNED_OUT', session);
        });
    },

    // เช็ค role ของผู้ใช้
    getUserRole: async (userId: string): Promise<string> => {
        const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data?.role || 'user';
    },

    // อัพเดท role ของผู้ใช้ (สำหรับ admin เท่านั้น)
    updateUserRole: async (targetUserId: string, newRole: 'user' | 'admin'): Promise<void> => {
        const { error } = await supabase
            .from('user_roles')
            .upsert({
                user_id: targetUserId,
                role: newRole
            });

        if (error) throw error;
    }
}; 