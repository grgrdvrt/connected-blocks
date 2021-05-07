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

export function cubic(a, b, c, d, t){
    const t2 = t*t;
    const ot = 1 - t;
    const ot2 = ot * ot;
    return a*ot2*ot + 3*b*ot2*t + 3*c*ot*t2 + d*t2*t;
}

function intToHex(value){
    return Math.round(value).toString(16);
}

export function hexToRgb(hex){
    return [
        parseInt(hex.substr(1, 2), 16),
        parseInt(hex.substr(3, 2), 16),
        parseInt(hex.substr(5, 2), 16)
    ];
}
export function rgbToHex(rgb){
    return "#" + intToHex(rgb[0]) + intToHex(rgb[1]) + intToHex(rgb[2]);
}

export function lerpColors(a, b, t){
    return [
        lerp(a[0], b[0], t),
        lerp(a[1], b[1], t),
        lerp(a[2], b[2], t),
    ];
}

