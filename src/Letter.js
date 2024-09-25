import fs from "fs";
import PDFDocument from "pdfkit";
import { assert } from "console";

import { pt } from "./Helpers.js";

export class LetterConfig {
    /**
     * @param {string} text
     */
    setReturnText(text) {
        this.returnText = text;
        return this;
    }

    /**
     * @param {string[]} lines
     */
    setReceiver(lines) {
        assert(lines.length <= 6, "Too many lines in receiver");
        this.receiver = lines;
        return this;
    }

    setSenderInformation(lines) {
        assert(lines.length <= 9, "Too many lines in receiver");
        this.sender = lines;
        return this;
    }

    /**
     * @param {string} text
     */
    setSubject(text) {
        this.subject = text;
        return this;
    }
}

export default class Letter {
    /**
     * Create a letter object
     * 
     * @param {string} lang Language code
     * @param {string} path Path to write the PDF to
     * @param {LetterConfig} config Letter config
     */
    constructor(
        lang = "de",
        path = "document.pdf",
        config = new LetterConfig()
    ) {
        this.config = config;

        this.doc = new PDFDocument({
            lang,
            size: "A4",
		    layout: "portrait",
            margins: {
                top: pt(4.5),
                bottom: pt(1),
                left: pt(2.5),
                right: pt(1),
            },
        });

        this.stream = fs.createWriteStream(path);
        this.doc.pipe(this.stream);

        this._writeLetter();
    }

    /**
     * Write text to letter
     */
    _writeLetter() {
        this.doc
		    .fontSize(8)
            .text(this.config.returnText, pt(2.5), pt(5.916));

        this.config.receiver.forEach((line, index) => {
            this.doc
                .fontSize(10)
                .text(line, pt(2.5), pt(6.27) + index * 10);
        });

        this.config.sender.forEach((line, index) => {
            this.doc
                .fontSize(10)
                .text(line, pt(12.5), pt(6) + index * 10);
        });

        this.doc
		    .fontSize(14)
		    .text(this.config.subject, pt(2.5), pt(10.346));
    }

    /**
     * Write the letter to a file and end the write stream
     */
    end() {
        this.doc.flushPages();
        this.doc.end();
    }
}
