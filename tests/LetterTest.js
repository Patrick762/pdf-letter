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
        .setSubject("Antwort auf Nachricht über Formular");

    const letter = new Letter(undefined, undefined, config);
    letter.end();
}
