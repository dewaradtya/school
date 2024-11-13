export const sanitizeNumberInput = (value, maxLength = 255) => {
    let numericValue = value.replace(/\D/g, '')
    return (numericValue.length > maxLength) ? numericValue.slice(0, maxLength) : numericValue;
}

export const disallowPipeCharacters = (value) => {
    return value.replace(/\|/g, '');
}