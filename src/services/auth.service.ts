import { AuthError, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const authService = {
    // ลงทะเบียนผู้ใช้ใหม่
    signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { user: data.user, error };
    },

    // เข้าสู่ระบบ
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { user: data.user, error };
    },

    // ออกจากระบบ
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    // ดึงข้อมูลผู้ใช้ปัจจุบัน
    getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // ตรวจสอบการเปลี่ยนแปลงสถานะการเข้าสู่ระบบ
    onAuthStateChange: (callback: (user: User | null) => void) => {
        return supabase.auth.onAuthStateChange((_, session) => {
            callback(session?.user ?? null);
        });
    }
}; 