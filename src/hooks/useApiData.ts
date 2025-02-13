import { useState, useEffect, useCallback } from 'react';

interface UseApiDataOptions<T> {
    fetchFn: () => Promise<T>;
    initialData?: T;
    onError?: (error: any) => void;
    errorMessage?: string;
}

export function useApiData<T>({
    fetchFn,
    initialData,
    onError,
    errorMessage = 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
}: UseApiDataOptions<T>) {
    const [data, setData] = useState<T | undefined>(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const result = await fetchFn();
            setData(result);
            setError(null);
        } catch (err) {
            const message = errorMessage || 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
            setError(message);
            console.error('Error loading data:', err);
            onError?.(err);
        } finally {
            setLoading(false);
        }
    }, [fetchFn, errorMessage, onError]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const refresh = useCallback(() => {
        loadData();
    }, [loadData]);

    return {
        data,
        loading,
        error,
        refresh,
        setData
    };
} 