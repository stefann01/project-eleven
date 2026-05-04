export function formatPercentage(value: number): string {
    return `${Math.round(value * 100)}%`;
}

export function formatDuration(seconds: number): string {
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export function formatDimension(dimension: string): string {
    return dimension.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}