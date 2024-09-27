import Invoice, { InvoiceConfig, InvoiceProduct } from "../src/Invoice.js";

export function testInvoice() {
    const products = [
        new InvoiceProduct("Produkt 1", 6.36),
        new InvoiceProduct("Versandkosten", 1.86),
    ];

    const config = new InvoiceConfig();
    config
        .setReturnText("Musterunternehmen | Am Musterweg 1 | 12345 Musterstadt")
        .setReceiver([
            "Max Mustermann",
            "Musterstraße 1",
            "12345 Musterhausen",
            "Deutschland",
        ])
        .setSenderInformation([
            "Musterunternehmen",
            "Am Musterweg 1",
            "12345 Musterstadt",
            "Telefon: 01234567890123",
            "E-Mail: max.e.mustermann@email.com",
            "",
            "Datum: 26.09.2024",
            "Rechnung: DE5845678657",
        ])
        .setLogo("./tests/testpattern2.png")
        .setSubject("Rechnung Nr. DE5845678657")
        .setFooter([
            "Musterunternehmen | Beispieltext | Geschäftsführer",
            "Bankverbindung | Weitere Infos",
        ])
        .setContent([
            "Sehr geehrter Herr Mustermann,",
            "vielen Dank für Ihre Bestellung. Sie erhalten hiermit die Rechnung zu Ihrer Bestellung",
            "Mit freundlichen Grüßen,",
            "Musterunternehmen",
            "",
            "",
            "",
            "Letzte Zeile",
        ])
        .setProducts(products)
        .setTaxPercentage(7)
        .setTax(0.58);

    const invoice = new Invoice(undefined, undefined, config);
    invoice.end();
}
