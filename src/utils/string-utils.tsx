export const truncateString = (string: string, charsLimit: number = 20): string => {
    const chars = string.split('');
    if (chars.length > charsLimit) {
        return chars.slice(0, charsLimit).join('') + '...';
    }
    return string;
};
