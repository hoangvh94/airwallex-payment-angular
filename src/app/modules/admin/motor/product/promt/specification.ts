//---------------2-----------------------
export function getSpecifications(items: any[]) {
    let html = '';

    items.forEach((item) => {
        let block = '<div>';

        if (item.Value) {
            block += `<div>Value: ${item.Value} ${item.UnitOfMeasure}</div>`;
        }

        if (item.MaxValue) {
            block += `<div>Max: ${item.MaxValue} ${item.UnitOfMeasure}</div>`;
        }

        if (item.MinValue) {
            block += `<div>Min: ${item.MinValue} ${item.UnitOfMeasure}</div>`;
        }

        if (item.Notes && item.Notes.length > 0) {
            block += '<ol>';
            item.Notes.forEach((note: string) => {
                block += `<li>${note}</li>`;
            });
            block += '</ol>';
        }

        block += '</div>';
        html += block;
    });

    return html;
}
