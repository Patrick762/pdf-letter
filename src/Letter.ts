import fs from "node:fs";
import PDFDocument from "pdfkit";
import { assert } from "console";
import { Writable } from "stream";

import { pt } from "./helpers";

export class LetterConfig {
    content: string[] = [];
    returnText = "";
    receiver: string[] = [];
    sender: string[] = [];
    logo?: string;
    subject = "";
    footer?: string[];
    showBorders?: boolean;

    setReturnText(text: string) {
        this.returnText = text;
        return this;
    }

    /**
     * @param lines Receiver lines (max 6)
     */
    setReceiver(lines: string[]) {
        assert(lines.length <= 6, "Too many lines in receiver");
        this.receiver = lines;
        return this;
    }

    /**
     * @param lines Sender information lines (max 9)
     */
    setSenderInformation(lines: string[]) {
        assert(lines.length <= 9, "Too many lines in sender");
        this.sender = lines;
        return this;
    }

    /**
     * @param logo Path to logo file
     */
    setLogo(logo: string) {
        this.logo = logo;
        return this;
    }

    setSubject(text: string) {
        this.subject = text;
        return this;
    }

    /**
     * @param lines Content lines (max 35)
     */
    setContent(lines: string[]) {
        assert(lines.length <= 35, "Too many lines in content");
        this.content = lines;
        return this;
    }

    /**
     * @param lines Footer lines (max 2)
     */
    setFooter(lines: string[]) {
        assert(lines.length <= 2, "Too many lines in footer");
        this.footer = lines;
        return this;
    }

    /**
     * Enable borders around the letter fields
     */
    setShowBorders(shown: boolean) {
        this.showBorders = shown;
        return this;
    }
}

export class Letter {
    fontSizeS: number;
    lineHeightS: number;
    fontSize: number;
    lineHeight: number;
    fontSizeL: number;
    lineHeightL: number;
    padLeft: number;
    config: LetterConfig;
    doc: PDFKit.PDFDocument;
    stream: Writable;
    contentStartY: number;

    /**
     * Create a letter object
     * 
     * @param lang Language code
     * @param path Path to write the PDF to
     * @param config Letter config
     * @param stream Write stream; overrides path
     * @param font Font ttf file
     */
    constructor(
        lang = "de",
        path = "letter.pdf",
        config = new LetterConfig(),
        stream?: Writable,
        font?: string,
    ) {
        this.fontSizeS = 8;
        this.lineHeightS = 12;
        this.fontSize = 12;
        this.lineHeight = 15;
        this.fontSizeL = 14;
        this.lineHeightL = 16;

        this.padLeft = pt(2);
        this.contentStartY = 0;

        this.config = config;

        this.doc = new PDFDocument({
            font,
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

        if (stream) {
            this.stream = stream;
        } else {
            this.stream = fs.createWriteStream(path);
        }
        this.doc.pipe(this.stream);

        this._drawBorders();
        this._writeLetterHead();
        this._writeLetterContent();
        this._writeFooter();
    }

    _drawBorders() {
        if (!this.config.showBorders) {
            return;
        }

        this.doc
            .rect(pt(2), pt(4.5), pt(9), pt(4.5))
            .rect(pt(12.5), pt(5), pt(7.5), pt(4))
            .lineWidth(2)
            .stroke("#f0f")
            .strokeColor("#000");
    }

    /**
     * Write letter head
     */
    _writeLetterHead() {
        const returnTextY = pt(4.5);
        const receiverSenderY = pt(5);

        this.doc
            .fontSize(this.fontSizeS)
            .text(this.config.returnText, this.padLeft, returnTextY);

        this.config.receiver.forEach((line, index) => {
            this.doc
                .fontSize(this.fontSize)
                .text(line, this.padLeft, receiverSenderY + this.lineHeightS + index * this.lineHeight);
        });

        this.config.sender.forEach((line, index) => {
            this.doc
                .fontSize(this.fontSizeS)
                .text(line, pt(12.5), receiverSenderY + index * this.lineHeightS);
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

        this.contentStartY = pt(10.346) + this.lineHeightL * 3;
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
