export function arraysDiff(newArray, oldArray){
    const result = {
        added:[],
        unchanged:[],
        removed:oldArray.filter(e => !newArray.includes(e)),
    };
    for(let i = 0; i < newArray.length; i++){
        const e = newArray[i];
        (oldArray.includes(e) ? result.unchanged : result.added).push(e);
    }
    return result;
}
