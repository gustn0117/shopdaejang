const SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'><defs><pattern id='p' width='14' height='14' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'><rect width='14' height='14' fill='#f4f4f5'/><line x1='0' y1='0' x2='0' y2='14' stroke='#d4d4d8' stroke-width='1.5'/></pattern></defs><rect width='400' height='300' fill='url(%23p)'/></svg>`;

export const STRIPED_BG = `data:image/svg+xml;utf8,${SVG.replace(/#/g, "%23").replace(/\n/g, "")}`;
