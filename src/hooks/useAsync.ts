import { useState, useCallback } from 'react';
import { Nullable } from '../types/common';

interface AsyncState<T> {
    data: Nullable<T>;
    loading: boolean;
    error: Nullable<string>;
}

interface UseAsyncReturn<T> extends AsyncState<T> {
    execute: (...args: any[]) => Promise<void>;
    setData: (data: T) => void;
    reset: () => void;
}

export function useAsync<T>(
    asyncFunction: (...args: any[]) => Promise<T>,
    immediate = true
): UseAsyncReturn<T> {
    const [state, setState] = useState<AsyncState<T>>({
        data: null,
        loading: immediate,
        error: null,
    });

    const execute = useCallback(
        async (...args: any[]) => {
            try {
                setState({ data: null, loading: true, error: null });
                const response = await asyncFunction(...args);
                setState({ data: response, loading: false, error: null });
            } catch (error) {
                setState({
                    data: null,
                    loading: false,
                    error: (error as Error).message,
                });
            }
        },
        [asyncFunction]
    );

    const setData = useCallback((data: T) => {
        setState(state => ({ ...state, data }));
    }, []);

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    return { ...state, execute, setData, reset };
} 