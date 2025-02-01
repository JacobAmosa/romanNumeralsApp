const convertToRoman = (num) => {
    // Array containing the different roman numeral symbols.
    const romanValues = [
        { value: 1000, numeral: 'M' },
        { value: 900, numeral: 'CM' },
        { value: 500, numeral: 'D' },
        { value: 400, numeral: 'CD' },
        { value: 100, numeral: 'C' },
        { value: 90, numeral: 'XC' },
        { value: 50, numeral: 'L' },
        { value: 40, numeral: 'XL' },
        { value: 10, numeral: 'X' },
        { value: 9, numeral: 'IX' },
        { value: 5, numeral: 'V' },
        { value: 4, numeral: 'IV' },
        { value: 1, numeral: 'I' }
    ];

    let result = '';

    // 1) Loop through the array of symbols
    // 2) Find the first symbol that is less than or equal to the user input from the array.
    // 3) Subtract the symbol's value from the user input.
    for (const pair of romanValues) {
        while (num >= pair.value) {
            result += pair.numeral;
            num -= pair.value;
        }
    }

    return result;
};

module.exports = convertToRoman;