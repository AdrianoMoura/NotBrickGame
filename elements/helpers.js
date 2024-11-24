// Recursively creates a deep copy of a matrix (array of arrays)
export function deepCopyMatrix(matrix) {
    if (!Array.isArray(matrix)) {
        throw new TypeError('Must be a matrix'); // Ensure input is a matrix
    }

    return matrix.map(row => {
        if (Array.isArray(row)) {
            return deepCopyMatrix(row); // Recursively copy nested arrays
        } else {
            return row; // Return the value for non-array elements
        }
    });
}

// Prevents default browser actions for certain key presses (e.g., scrolling)
export function preventKeyboard() {
    document.body.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === ' ') { // Keys to disable default behavior
            e.preventDefault(); // Prevent default actions like scrolling
        }
    });
}

export function circularShift(array, direction) {
    const newArray = [...array]
    if (direction === 1) {
        return [newArray.pop(), ...newArray];
    } else if (direction === -1) {
        return [...newArray.slice(1), newArray[0]];
    } else {
        return newArray;
    }
}

export function maxContinuousOccorrence(array, target) {
    let count = 0;
    for (let value of array) {
        if (value === target) {
            count++
        } else if (count > 0) {
            break;
        }
    }

    return count;
}