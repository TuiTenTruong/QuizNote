import { useEffect, useState } from "react";

export const formatVND = (value: number | string | null | undefined): string => {
    if (!value) {
        return "0d";
    }

    const amount = Number(value);
    if (Number.isNaN(amount)) {
        return "0d";
    }

    return `${Math.trunc(amount).toLocaleString("vi-VN")}d`;
};

export const useDebouncedValue = <T,>(value: T, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => window.clearTimeout(timer);
    }, [delay, value]);

    return debouncedValue;
};
