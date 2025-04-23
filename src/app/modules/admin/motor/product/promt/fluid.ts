//---------------3-------------------
export function getFluid(obj: any) {
    // Extract capacities
    const capacities = (obj.Capacities || [])
        .flatMap((cap) =>
            (cap.Items || [])
                .filter((i) => i.Value && i.UnitOfMeasure)
                .map((i) => `<li>${i.Value} ${i.UnitOfMeasure}</li>`)
        )
        .join('');

    // Extract fluid types
    const fluidTypes = (obj.Items || [])
        .filter((i) => i.Grade?.Description)
        .map((i) => `<li>${i.Grade.Description}</li>`)
        .join('');

    return `
    <ul>
      <li><strong>Capacities:</strong>
        <ul>${capacities}</ul>
      </li>
      <li><strong>Fluid Type(s):</strong>
        <ul>${fluidTypes}</ul>
      </li>
    </ul>
  `;
}
