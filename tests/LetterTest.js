import Letter, { LetterConfig } from "../src/Letter.js";

export function testLetter() {
    const config = new LetterConfig();
    config
        .setReturnText("Musterunternehmen | Am Musterweg 1 | 12345 Musterstadt")
        .setReceiver([
            "Max Mustermann",
            "Musterstraße 1",
            "12345 Musterhausen",
            "Deutschland",
        ])
        .setSenderInformation([
            "Abteilung: Kundenservice",
            "Ihr Berater: Max E. Mustermann",
            "",
            "Telefon: 01234567890123",
            "E-Mail: max.e.mustermann@email.com",
            "",
            "Datum: 25.09.2024",
        ])
        .setSubject("Antwort auf Nachricht über Formular");

    const letter = new Letter(undefined, undefined, config);
    letter.end();
}
