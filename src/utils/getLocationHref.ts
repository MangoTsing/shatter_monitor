export function getLocationHref(): string {
    if (typeof document === 'undefined' || document.location == null) return ''
    return document.location.href
}