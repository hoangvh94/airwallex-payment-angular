//---------------4-----------------
export function getMaintenanceSchedules(data: any) {
    if (!Array.isArray(data) || data.length === 0) return '';

    let html = '<ul>';
  
    data.forEach((item, index) => {
      html += `<li><strong>Interval ${index + 1}</strong><ul>`;
  
      if (item.FrequencyDescription) {
        html += `<li><strong>Frequency:</strong> ${item.FrequencyDescription}</li>`;
      }
  
      if (item.IntervalKilometer) {
        html += `<li><strong>Kilometers:</strong> ${item.IntervalKilometer}</li>`;
      }
  
      if (item.IntervalMile) {
        html += `<li><strong>Miles:</strong> ${item.IntervalMile}</li>`;
      }
  
      if (item.IntervalMonth) {
        html += `<li><strong>Months:</strong> ${item.IntervalMonth}</li>`;
      }
  
      if (item.IntervalOperatingHours) {
        html += `<li><strong>Operating Hours:</strong> ${item.IntervalOperatingHours}</li>`;
      }
  
      html += `</ul></li>`;
    });
  
    html += '</ul>';
    return html;
  }
