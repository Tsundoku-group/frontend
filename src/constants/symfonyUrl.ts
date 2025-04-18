export const symfonyUrl = (() => {
    const url = process.env.SYMFONY_URL;
    if (!url) throw new Error("Missing SYMFONY_URL environment variable");
    return url;
})();