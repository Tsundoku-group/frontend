export const truncateString = (string: string, wordLimit: number = 20): string => {
    const words = string.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return string;
};