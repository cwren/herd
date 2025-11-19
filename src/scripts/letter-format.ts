import PDFDocument from 'pdfkit';
import { type Address, type Rep } from '@/scripts/letter-state.js';
import { stateDecoder } from '@/scripts//states.ts';

const FONT_SIZE = 14;
const FOOTER_SIZE = 8;

function footer(doc: typeof PDFDocument, fontSize: number, letterId: string, buildingCode: string) {
    var bottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.fontSize(FOOTER_SIZE);
    const foot = `${buildingCode}`;
    const width = doc.widthOfString(foot);
    doc.text(letterId,
        doc.page.margins.left,
        doc.page.height - 50,
        {
            lineBreak: false
        },
    );
    doc.text(buildingCode,
        doc.page.width - width - doc.page.margins.right,
        doc.page.height - 50,
        {
            lineBreak: false
        },
    );
    doc.fontSize(fontSize);
    doc.text('', 50, 50);
    doc.page.margins.bottom = bottom;
}

export function letterToPdf(address: Address, rep: Rep, today: string, letterId: string, message: string, photo: string | null) {
    const postalCode = stateDecoder(address.state);
    const officeLine = rep.office !== "unknown" ? `${rep.office}\n`: "";
    const messageClean = message.replaceAll('\r', '');
    const margin = 72;
    const buildingNumber = rep.office === "unknown" ? "UNK" : rep.office.substring(0, 3);
    const buildingInitial = rep.office === "unknown" ? 'X' : rep.office[4];
    const senatorId = rep.id.replace(/_/g,'-');
    const buildingCode = `${buildingNumber}-${buildingInitial}-${senatorId}`;
    const doc = new PDFDocument({
        size: 'LETTER',
        font: 'Times-Roman',
        info: {
            'Title': `a constituent letter for ${rep.fullName}`,
            'Subject': `authored by ${address['name']} using HerdOnTheHill.org`,
        },
        margin: margin,
    });

    var fontSize = FONT_SIZE;
    doc.fontSize(fontSize);

    footer(doc, fontSize, letterId, buildingCode);
    
    var availableSpace = (doc.page.height
        - doc.page.margins.bottom
        - doc.page.margins.top
    );
    while ((doc.heightOfString(messageClean) + 20 * doc.currentLineHeight()) > availableSpace) {
        fontSize *= 0.95;
        doc.fontSize(fontSize);
    }

    const centering = (
        (availableSpace 
            - (doc.heightOfString(messageClean))
            - 20 * doc.currentLineHeight())
        / (2 * doc.currentLineHeight())
    );
    doc.moveDown(centering);

    let line1 = address.name;
    let line2 = address.line2 ? `${address.street}\n${address.line2}` : address.street;
    let line3 = `${address.city}, ${postalCode}, ${address.zipcode}`;
    let addressWidth = Math.max(
        doc.widthOfString(line1),
        doc.widthOfString(line2),
        doc.widthOfString(line3),
    );
    let addressIndent = doc.page.width - 2 * margin - addressWidth;

    if (photo) {
        addressIndent -= 75;
        doc.image(photo, doc.page.width - doc.page.margins.right - 75, doc.y, {width: 75});
    }
    doc.text(
        `${line1}\n${line2}\n${line3}`,
        {
            indent: addressIndent,
        }
    );
    doc.moveDown();

    doc.text(today);
    doc.moveDown();

    doc.text(
        `The Honorable ${rep.fullName}\n` +
        `United States Senate\n` +
        officeLine +  
        `Washington, D.C. 20510`
        );
    doc.moveDown(2.0);

    doc.text(`Dear Senator ${rep.salutation},`); doc.moveDown();

    doc.text(messageClean); doc.moveDown(2.0);

    doc.text('Sincerely yours,', {indent: 250});
    doc.text(address.name, {indent: 250});

    doc.end();
    return doc;
};