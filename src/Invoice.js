import fs from "fs";
import PDFDocument from "pdfkit";
import { assert } from "console";

import { pt } from "./Helpers.js";
import Letter, { LetterConfig } from "./Letter.js";

export class InvoiceProduct {
    /**
     * @param {string} name
     * @param {number} price
     * @param {number} amount
     */
    constructor(name, price, amount = 1) {
        this.name = name;
        this.price = price;
        this.amount = amount;
    }
}

export class InvoiceConfig extends LetterConfig {
    constructor() {
        super();
        this.currency = "€";
        this.taxPercentage = 19;
        this.decimalSymbol = ",";
        this.amountText = "Anzahl";
        this.descriptionText = "Beschreibung";
        this.priceSingleText = "Einzelpreis";
        this.priceSumText = "Summe";
        this.sumText = "Gesamt";
        this.inclTaxText = "Brutto";
    }

    /**
     * @param {string[]} lines
     */
    setContent(lines) {
        assert(lines.length <= 8, "Too many lines in content");
        this.content = lines;
        return this;
    }

    /**
     * @param {InvoiceProduct[]} products Products
     */
    setProducts(products) {
        this.products = products;
        return this;
    }

    /**
     * @param {string} currency
     */
    setCurrency(currency) {
        this.currency = currency;
        return this;
    }

    /**
     * @param {number} percentage
     */
    setTaxPercentage(percentage) {
        this.taxPercentage = percentage;
        return this;
    }

    /**
     * @param {number} tax
     */
    setTax(tax) {
        this.tax = tax;
        return this;
    }

    /**
     * @param {"."|","} symbol
     */
    setDecimalSymbol(symbol) {
        this.decimalSymbol = symbol;
    }
}

export default class Invoice extends Letter {
    /**
     * Create a letter object
     * 
     * @param {string} lang Language code
     * @param {string} path Path to write the PDF to
     * @param {InvoiceConfig} config Invoice config
     */
    constructor(
        lang = "de",
        path = "invoice.pdf",
        config = new InvoiceConfig(),
    ) {
        super(lang, path, config);
    }

    /**
     * Write letter content
     */
    _writeLetterContent() {
        const amountX = pt(2.5);
        const nameX = pt(4);
        const singleX = pt(13);
        const sumX = pt(17);

        // Table header
        this.doc
            .fontSize(10)
            .text(this.config.amountText, amountX, this.contentStartY)
            .text(this.config.descriptionText, nameX, this.contentStartY)
            .text(this.config.priceSingleText, singleX, this.contentStartY)
            .text(this.config.priceSumText, sumX, this.contentStartY);
        this.contentStartY = this.contentStartY + 15;

        // Product list
        this.config.products.forEach((product, index) => {
            this.doc
                .fontSize(10)
                .text(product.amount, amountX, this.contentStartY + index * 15)
                .text(product.name, nameX, this.contentStartY + index * 15)
                .text(product.price.toFixed(2).replace(".", this.config.decimalSymbol) + " " + this.config.currency, singleX, this.contentStartY + index * 15)
                .text((product.price * product.amount).toString().replace(".", this.config.decimalSymbol) + " " + this.config.currency, sumX, this.contentStartY + index * 15);
        });
        this.contentStartY = this.contentStartY + (this.config.products.length) * 15;

        // Sum
        const sumProducts = this.config.products.map(p => p.price).reduce((a, b) => a + b);
        this.doc
            .fontSize(12)
            .text(this.config.sumText, singleX, this.contentStartY)
            .text(sumProducts.toFixed(2).replace(".", this.config.decimalSymbol) + " " + this.config.currency, sumX, this.contentStartY);
        this.contentStartY = this.contentStartY + 17;

        // Tax
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

        // Text
        this.config.content.forEach((line, index) => {
            this.doc
                .fontSize(10)
                .text(line, pt(2.5), this.contentStartY + index * 15);
        });
    }
}
