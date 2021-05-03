export function lerp(a, b, t){
    return a + t * (b - a);
}

export function clamp(min, max, value){
    return Math.min(Math.max(min, value), max);
}

export function lerpPts(p1, p2, t){
    return {
        x:lerp(p1.x, p2.x, t),
        y:lerp(p1.y, p2.y, t),
    };
}

export function isInRectangle(box, pt){
    return pt.x >= box.x - 1
        && pt.y >= box.y - 1
        && pt.x <= box.x + box.width + 1
        && pt.y <= box.y + box.height + 1;
}

export function boxesIntersection(a, b){
    const xMin = Math.max(a.x, b.x);
    const xMax = Math.min(a.x + a.width, b.x + b.width);
    const yMin = Math.max(a.y, b.y);
    const yMax = Math.min(a.y + a.height, b.y + b.height);
    const width = Math.max(0, xMax - xMin);
    const height = Math.max(yMax - yMin);
    return {x:xMin, y:yMin, width, height};
}
