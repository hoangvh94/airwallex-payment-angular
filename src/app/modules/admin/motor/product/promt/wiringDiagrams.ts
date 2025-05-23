//---------------8-----------------
export function getWiringDiagrams(data: any) {
    if (!Array.isArray(data)) return '';

    const htmlItems = data
        .filter((item) => typeof item === 'string' && item.startsWith('http'))
        .map(
            (link) =>
                `<li><img src="${link}" alt="Diagram Image" style="max-width:100%;"></li>`
        );

    return `<ul>${htmlItems.join('')}</ul>`;
}
