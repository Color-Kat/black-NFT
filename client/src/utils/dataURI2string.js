export function dataURI2string(dataURI, sub = 29) {
    return atob(dataURI.substring(sub));
}