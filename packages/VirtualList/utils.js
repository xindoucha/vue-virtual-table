/**
 * binary search
 * @param {Array} arr 
 * @param {Number} value 
 */
export function harfSearch(arr,value) {
  if (!Array.isArray(arr)) {
    throw new TypeError("arr is not an Array!")
  }
  let startIndex = 0;
  let endIndex = arr.length -1;
  while (startIndex <= endIndex) {
    let middleIndex = parseInt((startIndex+endIndex)/2);
    let middleValue = arr[middleIndex];
    if (middleValue>value && arr[middleIndex-1]<value) {
      return middleIndex-1;
    }
    if (middleValue === value) {
      return middleIndex
    } else if (middleValue < value){
      startIndex = middleIndex+1
    } else {
      endIndex = middleIndex-1
    }
  }
}

/**
 * throttle
 * @param {Function} fn 
 * @param {number} delay 
 */
export function throttle(fn,delay){
  if (typeof fn !== "function") {
    throw new TypeError("fn is not a Function!")
  }
  let timer = null;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.call(this,...args)
      }, delay);
    }
  }
}
