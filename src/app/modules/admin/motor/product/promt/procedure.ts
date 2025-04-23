//-----------6---------------
export function getProcedure(items: any[]): string {
    let result = '';

    items.forEach((item) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(item.Data, 'text/xml');
        let xmlString = new XMLSerializer().serializeToString(xml);

        // Replace <emph> with styled <span>
        xmlString = xmlString.replace(
            /<emph type="([^"]+)">(.*?)<\/emph>/g,
            (_, type, content) => {
                const classMap: any = {
                    bold: 'font-semibold',
                    dquote: 'italic text-gray-600',
                };
                return `<span class="${classMap[type] || ''}">${content}</span>`;
            }
        );

        // Replace xref with corresponding <img> if document found
        item.ReferenceSet?.Documents?.forEach((doc: any) => {
            const id = doc.Name;
            const href = doc.Links?.[0]?.Href;
            const caption = doc.Caption || '';
            if (href) {
                const imgHtml = `
            <div class="my-4">
              <img src="${href}" alt="${caption}" class="rounded-md shadow border max-w-full" />
              <div class="text-sm text-gray-600 mt-1">${caption}</div>
            </div>`;
                const xrefRegex = new RegExp(
                    `<xref[^>]*idref=["']${id}["'][^>]*/>`,
                    'gi'
                );
                // Remove dot right after xref
                xmlString = xmlString.replace(/(<xref[^>]*\/>)\./g, '$1');
                
                xmlString = xmlString.replace(xrefRegex, imgHtml);
            }
        });

        // Remove dot right after xref
        // xmlString = xmlString.replace(/(<xref[^>]*\/>)\./g, '$1');
        // Replace stepgrp/stepgrp2 with <ol> and <li>
        xmlString = xmlString
            .replace(
                /<stepgrp[^>]*>/g,
                `<ol class="list-decimal pl-6 space-y-2 text-gray-800 text-base">`
            )
            .replace(/<\/stepgrp>/g, `</ol>`)
            .replace(
                /<stepgrp2[^>]*>/g,
                `<ol class="list-decimal pl-6 space-y-2 text-gray-800 text-base">`
            )
            .replace(/<\/stepgrp2>/g, `</ol>`)
            .replace(/<step[^>]*>/g, `<li>`)
            .replace(/<\/step>/g, `</li>`);

        // Replace <p> with styled <p>
        xmlString = xmlString.replace(/<p>/g, `<p class="mb-4 text-gray-700">`);

        // Remove root tags like <MOTOR_Procedure>
        xmlString = xmlString.replace(/<\/?MOTOR_Procedure[^>]*>/g, '');

        result += xmlString;
    });

    return result;
}
