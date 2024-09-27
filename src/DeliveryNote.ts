import { assert } from "console";
import { Writable } from "stream";

import { pt } from "./helpers";
import { Letter, LetterConfig } from "./Letter";

export class DeliveryNoteProduct {
    name: string;
    amount: number;

    constructor(name: string, amount = 1) {
        this.name = name;
        this.amount = amount;
    }
}

export class DeliveryNoteConfig extends LetterConfig {
    amountText: string;
    descriptionText: string;
    products: DeliveryNoteProduct[];

    constructor() {
        super();
        this.amountText = "Anzahl";
        this.descriptionText = "Beschreibung";
        this.products = [];
    }

    /**
     * @param lines Content lines (max 8)
     */
    setContent(lines: string[]) {
        assert(lines.length <= 8, "Too many lines in content");
        this.content = lines;
        return this;
    }

    /**
     * @param products Products (max 8)
     */
    setProducts(products: DeliveryNoteProduct[]) {
        assert(products.length <= 8, "Too many lines in products");
        this.products = products;
        return this;
    }
}

export class DeliveryNote extends Letter {
    config: DeliveryNoteConfig;

    /**
     * Create a delivery note object
     * 
     * @param lang Language code
     * @param path Path to write the PDF to
     * @param config Invoice config
     * @param stream Write stream; overrides path
     */
    constructor(
        lang = "de",
        path = "deliveryNote.pdf",
        config = new DeliveryNoteConfig(),
        stream?: Writable,
    ) {
        super(lang, path, config, stream);
        this.config = config;
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
                .text(product.amount.toString(), amountX, this.contentStartY + index * this.lineHeight)
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
