/**
 * 插入/更新数组中对应id的元素
 * @param array
 * @param elements
 * @returns {*|{options, bootstrap}|*[]|string}
 */
export function insert(array, ...elements) {
    elements = [...elements];
    let result = array.map(x => {
        let index = elements.findIndex(y => y.id === x.id);
        if (index !== -1) {
            return elements.splice(index, 1)[0];
        }
        else {
            return x;
        }
    });

    return result.concat(elements);
}