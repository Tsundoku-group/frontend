export const extractFirebasePath = (url: string): string | null => {
    const regex = /\/o\/(.*)\?alt/;
    const match = url.match(regex);
    return match && match[1] ? decodeURIComponent(match[1]) : null;
};