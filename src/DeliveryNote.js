import { assert } from "console";

import { pt } from "./Helpers.js";
import Letter, { LetterConfig } from "./Letter.js";

export class DeliveryNoteProduct {
    /**
     * @param {string} name
     * @param {number} amount
     */
    constructor(name, amount = 1) {
        this.name = name;
        this.amount = amount;
    }
}

export class DeliveryNoteConfig extends LetterConfig {
    constructor() {
        super();
        this.amountText = "Anzahl";
        this.descriptionText = "Beschreibung";
    }

    /**
     * @param {string[]} lines Content lines (max 8)
     */
    setContent(lines) {
        assert(lines.length <= 8, "Too many lines in content");
        this.content = lines;
        return this;
    }

    /**
     * @param {DeliveryNoteProduct[]} products Products (max 8)
     */
    setProducts(products) {
        assert(products.length <= 8, "Too many lines in products");
        this.products = products;
        return this;
    }
}

export default class DeliveryNote extends Letter {
    /**
     * Create a letter object
     * 
     * @param {string} lang Language code
     * @param {string} path Path to write the PDF to
     * @param {DeliveryNoteConfig} config Invoice config
     */
    constructor(
        lang = "de",
        path = "deliveryNote.pdf",
        config = new DeliveryNoteConfig(),
    ) {
        super(lang, path, config);
    }

    /**
     * Write letter content
     */
    _writeLetterContent() {
        const amountX = this.padLeft;
        const nameX = pt(4);

        // Table header
        this.doc
            .fontSize(this.fontSize)
            .text(this.config.amountText, amountX, this.contentStartY)
            .text(this.config.descriptionText, nameX, this.contentStartY)
        this.contentStartY = this.contentStartY + this.lineHeight;

        // Product list
        this.config.products.forEach((product, index) => {
            this.doc
                .fontSize(this.fontSize)
                .text(product.amount, amountX, this.contentStartY + index * this.lineHeight)
                .text(product.name, nameX, this.contentStartY + index * this.lineHeight);
        });
        this.contentStartY = this.contentStartY + (this.config.products.length) * this.lineHeight;
        this.contentStartY = this.contentStartY + 3 * 17;

        // Text
        this.config.content.forEach((line, index) => {
            this.doc
                .fontSize(this.fontSize)
                .text(line, this.padLeft, this.contentStartY + index * this.lineHeight);
        });
    }
}
