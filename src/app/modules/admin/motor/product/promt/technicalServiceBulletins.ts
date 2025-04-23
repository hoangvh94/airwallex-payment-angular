//---------------1-----------------------
export function getTechnicalServiceBulletins(data: any) {
    if (!data || typeof data !== 'object') return '';

    let html = '<ul>';

    if (data.manufacturerCommunicationNumber) {
        html += `<li><strong>Manufacturer Communication Number:</strong> ${data.manufacturerCommunicationNumber}</li>`;
    }

    if (data.summary) {
        html += `<li><strong>Summary:</strong> ${data.summary}</li>`;
    }

    if (Array.isArray(data.components) && data.components.length > 0) {
        html += `<li><strong>Components:</strong><ul>`;
        data.components.forEach((comp) => {
            html += `<li>
        <div><strong>Name:</strong> ${comp.name}</div>
        <div><strong>Description:</strong> ${comp.description}</div>
      </li>`;
        });
        html += '</ul></li>';
    }

    if (
        Array.isArray(data.associatedDocuments) &&
        data.associatedDocuments.length > 0 &&
        data.associatedDocuments[0] !== 'null'
    ) {
        html += `<li><strong>Associated Documents:</strong><ul>`;
        data.associatedDocuments.forEach((doc) => {
            html += `<li>${doc}</li>`;
        });
        html += '</ul></li>';
    }

    html += '</ul>';
    return html;
}
