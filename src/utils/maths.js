export function lerp(a, b, t){
    return a + t * (b - a);
}

export function clamp(min, max, value){
    return Math.min(Math.max(min, value), max);
}
