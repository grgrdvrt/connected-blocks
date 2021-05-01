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
