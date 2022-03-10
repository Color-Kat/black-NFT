export const shortenString = (string: string, length = 20) => {
    return string.slice(0, length) + (string.length > length ? '...' : '');
}