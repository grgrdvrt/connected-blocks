import {svg} from "./dom";
/**align**/

const alignAttributes = {
    "enable-background":"new 0 0 24 24",
    height:"15px",
    viewBox:"0 0 24 24",
    width:"15px",
    fill:"#555555",
};

export const verticalAlignIcon = () => svg("svg", {
    attributes:alignAttributes,
    children:[
        svg("rect", {attributes:{fill:"none", height:"24", width:"24"}}),
        svg("polygon", {attributes:{points:"11,2 13,2 13,7 21,7 21,10 13,10 13,14 18,14 18,17 13,17 13,22 11,22 11,17 6,17 6,14 11,14 11,10 3,10 3,7 11,7"}})
    ]
});

export const topAlignIcon = () => svg("svg", {
    attributes:alignAttributes,
    children:[
        svg("rect", {attributes:{fill:"none", height:"24", width:"24"}}),
        svg("path", {attributes:{d:"M22,2v2H2V2H22z M7,22h3V6H7V22z M14,16h3V6h-3V16z"}})
    ]
});

export const bottomAlignIcon = () => svg("svg", {
    attributes:alignAttributes,
    children:[
        svg("rect", {attributes:{fill:"none", height:"24", width:"24"}}),
        svg("path", {attributes:{d:"M22,22H2v-2h20V22z M10,2H7v16h3V2z M17,8h-3v10h3V8z"}})
    ]
});

export const horizontalAlignIcon = () => svg("svg", {
    attributes:alignAttributes,
    children:[
        svg("rect", {attributes:{fill:"none", height:"24", width:"24"}}),
        svg("polygon", {attributes:{points:"22,11 17,11 17,6 14,6 14,11 10,11 10,3 7,3 7,11 1.84,11 1.84,13 7,13 7,21 10,21 10,13 14,13 14,18 17,18 17,13 22,13"}})
    ]
});

//left
export const leftAlignIcon = () => svg("svg", {
    attributes:alignAttributes,
    children:[
        svg("rect", {attributes:{fill:"none", height:"24", width:"24"}}),
        svg("path", {attributes:{d:"M4,22H2V2h2V22z M22,7H6v3h16V7z M16,14H6v3h10V14z"}})
    ]
});

export const rightAlignIcon = () => svg("svg", {
    attributes:alignAttributes,
    children:[
        svg("rect", {attributes:{fill:"none", height:"24", width:"24"}}),
        svg("path", {attributes:{d:"M20,2h2v20h-2V2z M2,10h16V7H2V10z M8,17h10v-3H8V17z"}})
    ]
});


const baseAttributes = {
    height:"15px",
    viewBox:"0 0 24 24",
    width:"15px",
    fill:"#555555",
};

export const linkIcon = () => svg("svg", {
    attributes:baseAttributes,
    children:[
        svg("path", {attributes:{fill:"none", d:"M0 0h24v24H0"}}),
        svg("path", {attributes:{d:"M8 11h8v2H8zm12.1 1H22c0-2.76-2.24-5-5-5h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1zM3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM19 12h-2v3h-3v2h3v3h2v-3h3v-2h-3z"}})
    ]
});

export const deleteIcon = () => svg("svg", {
    attributes:baseAttributes,
    children:[
        svg("path", {attributes:{fill:"none", d:"M0 0h24v24H0z"}}),
        svg("path", {attributes:{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"}})
    ]
});

export const saveIcon = () => svg("svg", {
    attributes:baseAttributes,
    children:[
        svg("path", {attributes:{fill:"none", d:"M0 0h24v24H0z"}}),
        svg("path", {attributes:{d:"M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"}})
    ]
});

export const addFileIcon = () => svg("svg", {
    attributes:baseAttributes,
    children:[
        svg("path", {attributes:{fill:"none", d:"M0 0h24v24H0z"}}),
        svg("path", {attributes:{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}})
    ]
});

export const undoIcon = () => svg("svg", {
    attributes:baseAttributes,
    children:[
        svg("path", {attributes:{fill:"none", d:"M0 0h24v24H0z"}}),
        svg("path", {attributes:{d:"M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"}})
    ]
});

export const redoIcon = () => svg("svg", {
    attributes:baseAttributes,
    children:[
        svg("path", {attributes:{fill:"none", d:"M0 0h24v24H0z"}}),
        svg("path", {attributes:{d:"M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"}})
    ]
});
