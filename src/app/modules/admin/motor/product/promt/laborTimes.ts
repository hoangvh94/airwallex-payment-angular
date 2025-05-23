//---------------5------------------
export function getLaborTimes(laborData: any) {
    if (!Array.isArray(laborData) || laborData.length === 0) return '';

    let html = '<ul>';

    laborData.forEach((item, index) => {
        html += `<li><strong>Labor Item ${index + 1}</strong><ul>`;

        // Notes
        if (Array.isArray(item.Notes) && item.Notes.length > 0) {
            html += `<li><strong>Notes:</strong><ul>`;
            item.Notes.forEach((note) => {
                html += `<li>${note.Text}</li>`;
            });
            html += `</ul></li>`;
        }

        // Base Labor Time
        if (item.BaseLaborTime) {
            html += `<li><strong>Base Labor Time:</strong> ${item.BaseLaborTime} ${item.LaborTimeInterval || ''}</li>`;
        }

        // Base Warranty Labor Time
        if (item.BaseWarrantyLaborTime) {
            html += `<li><strong>Base Warranty Labor Time:</strong> ${item.BaseWarrantyLaborTime} ${item.LaborTimeInterval || ''}</li>`;
        }

        // Required Skill
        if (item.RequiredSkill) {
            html += `<li><strong>Required Skill:</strong><ul>`;
            html += `<li><strong>Name:</strong> ${item.RequiredSkill.Name}</li>`;
            html += `<li><strong>Description:</strong> ${item.RequiredSkill.Description}</li>`;
            html += `</ul></li>`;
        }

        html += `</ul></li>`;
    });

    html += '</ul>';
    return html;
}
