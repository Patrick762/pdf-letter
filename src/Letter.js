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
     * @param {string[]} lines Receiver lines (max 6)
     */
    setReceiver(lines) {
        assert(lines.length <= 6, "Too many lines in receiver");
        this.receiver = lines;
        return this;
    }

    /**
     * @param {string[]} lines Sender information lines (max 9)
     */
    setSenderInformation(lines) {
        assert(lines.length <= 9, "Too many lines in sender");
        this.sender = lines;
        return this;
    }

    /**
     * @param {string} logo Path to logo file
     */
    setLogo(logo) {
        this.logo = logo;
        return this;
    }

    /**
     * @param {string} text
     */
    setSubject(text) {
        this.subject = text;
        return this;
    }

    /**
     * @param {string[]} lines Content lines (max 35)
     */
    setContent(lines) {
        assert(lines.length <= 35, "Too many lines in content");
        this.content = lines;
        return this;
    }

    /**
     * @param {string[]} lines Footer lines (max 2)
     */
    setFooter(lines) {
        assert(lines.length <= 2, "Too many lines in footer");
        this.footer = lines;
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
        path = "letter.pdf",
        config = new LetterConfig(),
    ) {
        this.fontSizeS = 8;
        this.lineHeightS = 15;
        this.fontSize = 12;
        this.lineHeight = 15;
        this.fontSizeL = 14;
        this.lineHeightL = 16;

        this.padLeft = pt(2);

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

        this._writeLetterHead();
        this._writeLetterContent();
        this._writeFooter();
    }

    /**
     * Write letter head
     */
    _writeLetterHead() {
        this.doc
            .fontSize(this.fontSizeS)
            .text(this.config.returnText, this.padLeft, pt(5.916));

        this.config.receiver.forEach((line, index) => {
            this.doc
                .fontSize(this.fontSize)
                .text(line, this.padLeft, pt(6) + this.lineHeightS + index * this.lineHeight);
        });

        this.config.sender.forEach((line, index) => {
            this.doc
                .fontSize(this.fontSize)
                .text(line, pt(12.5), pt(6) + index * this.lineHeight);
        });

        if (this.config.logo) {
            this.doc.image(
                this.config.logo,
                pt(12.5), pt(2),
                {
                    width: pt(6),
                },
            );
        }

        this.doc
            .fontSize(this.fontSizeL)
            .text(this.config.subject, this.padLeft, pt(10.346));

        this.contentStartY = pt(10.346) + this.lineHeightL * 2;
    }

    /**
     * Write letter content
     */
    _writeLetterContent() {
        this.config.content.forEach((line, index) => {
            this.doc
                .fontSize(this.fontSize)
                .text(line, this.padLeft, this.contentStartY + index * this.lineHeight);
        });
    }

    /**
     * Write document footer
     */
    _writeFooter() {
        if (!this.config.footer) {
            return;
        }

        this.doc
            .moveTo(pt(1), pt(26.5))
            .lineTo(pt(20), pt(26.5))
            .stroke();

        this.config.footer.forEach((line, index) => {
            this.doc
                .fontSize(this.fontSizeS)
                .text(line, this.padLeft, pt(27) + index * this.lineHeightS, {align: "center"});
        });
    }

    /**
     * Write the letter to a file and end the write stream
     */
    end() {
        this.doc.flushPages();
        this.doc.end();
    }
}
