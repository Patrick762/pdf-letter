import Letter, { LetterConfig } from "../src/Letter.js";

export function testLetter() {
    const config = new LetterConfig();
    config
        .setReturnText("Musterunternehmen | Am Musterweg 1 | 12345 Musterstadt")
        .setReceiver([
            "AnderesUnternehmen",
            "z.H. Max Mustermann",
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
        .setLogo("./tests/testpattern1.png")
        .setSubject("Antwort auf Nachricht über Formular")
        .setFooter([
            "Musterunternehmen | Beispieltext | Anderes bla bla",
            "Bankverbindung | Weitere Infos",
        ])
        .setContent([
            "Sehr geehrter Herr Mustermann,",
            "wie bereits in unserem Gespräch besprochen, bla bla bla",
            "",
            "Mit freundlichen Grüßen,",
            "",
            "Max E. Mustermann",
            "Kundenberater Musterunternehmen",
        ]);

    const letter = new Letter(undefined, undefined, config);
    letter.end();
}
