import { assert } from "console";
import { Writable } from "stream";

import { pt } from "./helpers";
import { Letter, LetterConfig } from "./Letter";

export class InvoiceProduct {
    name: string;
    price: number;
    amount: number;

    constructor(name: string, price: number, amount = 1) {
        this.name = name;
        this.price = price;
        this.amount = amount;
    }
}

export class InvoiceConfig extends LetterConfig {
    currency = "€";
    taxPercentage = 19;
    decimalSymbol = ",";
    amountText = "Anzahl";
    descriptionText = "Beschreibung";
    priceSingleText = "Einzelpreis";
    priceSumText = "Summe";
    sumText = "Gesamt";
    tax?: number;
    inclTaxText = "Brutto";
    products: InvoiceProduct[] = [];

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
    setProducts(products: InvoiceProduct[]) {
        assert(products.length <= 8, "Too many lines in products");
        this.products = products;
        return this;
    }

    setCurrency(currency: string) {
        this.currency = currency;
        return this;
    }

    setTaxPercentage(percentage: number) {
        this.taxPercentage = percentage;
        return this;
    }

    setTax(tax: number) {
        this.tax = tax;
        return this;
    }

    setDecimalSymbol(symbol: "."|",") {
        this.decimalSymbol = symbol;
        return this;
    }
}

export class Invoice extends Letter {
    config: InvoiceConfig;

    /**
     * Create a invoice object
     * 
     * @param lang Language code
     * @param path Path to write the PDF to
     * @param config Invoice config
     * @param stream Write stream; overrides path
     * @param font Font ttf file
     */
    constructor(
        lang = "de",
        path = "invoice.pdf",
        config = new InvoiceConfig(),
        stream?: Writable,
        font?: string,
    ) {
        super(lang, path, config, stream, font);
        this.config = config;
    }

    /**
     * Write letter content
     */
    _writeLetterContent() {
        const amountX = this.padLeft;
        const nameX = pt(4);
        const singleX = pt(13);
        const sumX = pt(17);

        // Table header
        this.doc
            .fontSize(this.fontSize)
            .text(this.config.amountText, amountX, this.contentStartY)
            .text(this.config.descriptionText, nameX, this.contentStartY)
            .text(this.config.priceSingleText, singleX, this.contentStartY)
            .text(this.config.priceSumText, sumX, this.contentStartY);
        this.contentStartY = this.contentStartY + this.lineHeight;

        // Line
        this.doc
            .moveTo(amountX - 5, this.contentStartY)
            .lineTo(pt(19), this.contentStartY)
            .stroke();
        this.contentStartY = this.contentStartY + 5;

        // Product list
        this.config.products.forEach((product, index) => {
            this.doc
                .fontSize(this.fontSize)
                .text(product.amount.toString(), amountX, this.contentStartY + index * this.lineHeight)
                .text(product.name, nameX, this.contentStartY + index * this.lineHeight)
                .text(product.price.toFixed(2).replace(".", this.config.decimalSymbol) + " " + this.config.currency, singleX, this.contentStartY + index * this.lineHeight)
                .text((product.price * product.amount).toFixed(2).replace(".", this.config.decimalSymbol) + " " + this.config.currency, sumX, this.contentStartY + index * this.lineHeight);
        });
        this.contentStartY = this.contentStartY + (this.config.products.length) * this.lineHeight;

        // Sum
        const sumProducts = this.config.products.map(p => p.price * p.amount).reduce((a, b) => a + b);
        this.doc
            .fontSize(12)
            .text(this.config.sumText, singleX, this.contentStartY)
            .text(sumProducts.toFixed(2).replace(".", this.config.decimalSymbol) + " " + this.config.currency, sumX, this.contentStartY);
        this.contentStartY = this.contentStartY + 17;

        // Tax
        if(this.config.tax) {
            this.doc
                .fontSize(12)
                .text("+ MwSt. " + this.config.taxPercentage + "%", singleX, this.contentStartY)
                .text(this.config.tax.toFixed(2).replace(".", this.config.decimalSymbol) + " " + this.config.currency, sumX, this.contentStartY);
            this.contentStartY = this.contentStartY + 17;

            // Price incl. Tax
            const fullSum = sumProducts + this.config.tax;
            this.doc
                .fontSize(12)
                .text(this.config.inclTaxText, singleX, this.contentStartY)
                .text(fullSum.toFixed(2).replace(".", this.config.decimalSymbol) + " " + this.config.currency, sumX, this.contentStartY);
            this.contentStartY = this.contentStartY + 3 * 17;
        }

        // Text
        this.config.content.forEach((line, index) => {
            this.doc
                .fontSize(this.fontSize)
                .text(line, this.padLeft, this.contentStartY + index * this.lineHeight);
        });
    }
}
