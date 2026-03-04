export function calculateReadingTime(text: string): number {
    const wordsPerMinute = 225;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return time < 1 ? 1 : time;
}
