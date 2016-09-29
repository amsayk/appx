const defaultColors = [
    '#d73d32',
    '#7e3794',
    '#4285f4',
    '#67ae3f',
    '#d61a7f',
    '#ff4080'
];

function _stringAsciiCodeSum(value) {
    return [...value]
        .map(letter => letter.charCodeAt(0))
        .reduce((current, previous) => previous + current);
}

export default function getRandomColor(value, colors = defaultColors) {
    // if no value is passed, always return transparent color otherwise
    // a rerender would show a new color which would will
    // give strange effects when an interface is loading
    // and gets rerendered a few consequent times
    if(!value)
        return 'transparent';

    // value based random color index
    // the reason we don't just use a random number is to make sure that
    // a certain value will always get the same color assigned given
    // a fixed set of colors
    const sum = _stringAsciiCodeSum(value);
    const colorIndex = (sum % colors.length);
    return colors[colorIndex];
}
