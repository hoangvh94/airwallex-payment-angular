//---------------7-------------------
export function getDiagnosticTroubleCodes(data: any) {
    if (!Array.isArray(data)) return '';

    const htmlItems = data.map((entry) => {
        const code = entry.Item?.Code || '';
        const codeType = entry.Item?.CodeType || '';
        const description = entry.Item?.Description || '';
        const imgLinks = (entry.Links || [])
            .map(
                (link) =>
                    `<img src="${link.Href}" alt="Code Diagram" style="max-width:100%;">`
            )
            .join('');

        return `
        <li>
          <strong>Code:</strong> ${code}<br>
          <strong>Code Type:</strong> ${codeType}<br>
          <strong>Description:</strong> ${description}<br>
          ${imgLinks}
        </li>
      `;
    });

    return `<ul>${htmlItems.join('')}</ul>`;
}
