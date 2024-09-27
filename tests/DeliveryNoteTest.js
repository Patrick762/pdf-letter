import DeliveryNote, { DeliveryNoteConfig, DeliveryNoteProduct } from "../src/DeliveryNote.js";

export function testDeliveryNote() {
    const products = [
        new DeliveryNoteProduct("Produkt 1", 12),
        new DeliveryNoteProduct("Produkt 2", 5),
    ];

    const config = new DeliveryNoteConfig();
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
            "Datum: 27.09.2024",
        ])
        .setLogo("./tests/testpattern2.png")
        .setSubject("Lieferschein Nr. DE5845678657")
        .setFooter([
            "Musterunternehmen | Beispieltext | Geschäftsführer",
            "Bankverbindung | Weitere Infos",
        ])
        .setProducts(products);

    const deliveryNote = new DeliveryNote(undefined, undefined, config);
    deliveryNote.end();
}
