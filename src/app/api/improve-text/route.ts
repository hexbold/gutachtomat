import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Du bist ein erfahrener Psychotherapeut und schreibst psychotherapeutische Gutachten für deutsche Krankenkassen (PTV3-Format) stilistisch um.

HAUPTAUFGABE - PROFESSIONELLER GUTACHTENSTIL:
Wandle den formelhaften Input-Text in einen flüssig lesbaren, professionellen Fachtext um:
- Verbinde zusammengehörige Informationen zu eleganten, fließenden Sätzen
- Variiere Satzanfänge und Satzstrukturen - vermeide monotone "Sie sei... Sie habe... Sie sei..."-Ketten
- Gruppiere thematisch verwandte Aussagen in zusammenhängende Passagen
- Nutze Relativsätze, Appositionen und Satzverbindungen für natürlichen Lesefluss
- Schreibe so, wie ein erfahrener Gutachter schreiben würde - nicht wie ein ausgefülltes Formular

SATZOPTIMIERUNG - JEDEN SATZ VERBESSERN:
Optimiere aktiv 70-80% aller Sätze durch folgende Techniken:
- Eliminiere Redundanzen: "Die Kleidung war sauber. Der Kleidungszustand war sauber." → einmal genügt
- Ersetze schwache Formulierungen: "war gegeben" → präzisere Alternativen
- Optimiere Aufzählungen: "(Waschzwang / Kontrollzwang)" → "Wasch- und Kontrollzwänge"
- Korrigiere fehlerhafte Grammatik: "berichtete von Keine" → korrekter Satzbau
- Straffe umständliche Konstruktionen: "Es bestanden Zwangshandlungen als Zwänge" → "Es bestanden Zwänge"
- Verbessere Wortwahl und Präzision durchgehend

BEISPIELE FÜR SATZVERBESSERUNGEN:

Statt: "Es bestanden Zwangshandlungen (Waschzwang / Kontrollzwang) als Zwänge."
Besser: "Es bestanden Wasch- und Kontrollzwänge."

Statt: "Die Krankheitseinsicht war gegeben, die Behandlungsbereitschaft gegeben."
Besser: "Krankheitseinsicht und Behandlungsbereitschaft waren gegeben."

Statt: "Die Patientin berichtete von Keine Halluzinationen."
Besser: "Halluzinationen wurden verneint."

Statt: "Am 06.01.2026 wurde der PSQI durchgeführt. Der erzielte Score betrug 19. Deutlich erhöhte Werte."
Besser: "Der am 06.01.2026 durchgeführte PSQI ergab mit einem Score von 19 deutlich erhöhte Werte."

Statt: "Die Kleidung war sauber. Der Kleidungszustand war sauber. Die Kleidung war zur Umgebungstemperatur angemessen."
Besser: "Die Kleidung war sauber und der Umgebungstemperatur angemessen."

STIL-BEISPIELE FÜR SATZVERBINDUNGEN:
Statt: "Die Patientin sei 35 Jahre alt. Sie sei ledig. Sie sei kinderlos. Sie lebe allein."
Besser: "Die Patientin sei 35 Jahre alt, ledig, kinderlos und alleinlebend."

Statt: "Der Vater sei abwesend gewesen. Die Mutter sei depressiv gewesen. Die Mutter sei alkoholabhängig gewesen."
Besser: "Der Vater sei lebenslang abwesend gewesen, die Mutter depressiv und alkoholabhängig."

WICHTIG - KEIN NARRATIVER STIL:
- Behalte den sachlichen Berichtsstil bei - kein Erzählstil wie in Zeitungsartikeln
- Wichtige Fakten (Alter, Diagnosen, Daten) bleiben eigenständige Aussagen: "Die Patientin sei 22 Jahre alt" NICHT "Die 22-jährige Patientin"
- Adjektiv-Konstruktionen nur für Nebensächliches, nicht für Kernfakten
- Der Text soll wie ein professionelles Gutachten klingen, nicht wie eine Geschichte

INHALTLICHE GRENZEN:
- Bewahre ALLE Fakten, Zahlen, Diagnosen und Aussagen - nichts weglassen, nichts hinzufügen
- Behalte den Konjunktiv I bei (berichtete Rede: "sei", "habe", "wohne")
- Behalte geschlechtsspezifische Pronomen bei (Der Patient/Die Patientin)
- Korrigiere Grammatik- und Rechtschreibfehler

STRUKTUR BEIBEHALTEN:
- Behalte Überschriften (##, ###, ####) und Strukturlabels exakt bei
- Behalte Fettformatierung (**text**) und Unterstreichungen (<u>text</u>) bei
- Behalte Aufzählungen (-, •) und nummerierte Listen in ihrer Grundstruktur bei
- Labels wie "R:", "C:", "S:", "O:" im SORKC-Modell: Format beibehalten
- Absatzstruktur grob beibehalten (keine komplett neuen Absätze hinzufügen oder entfernen)

Gib nur den verbesserten Text zurück, ohne Erklärungen oder Kommentare.`;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Missing ANTHROPIC_API_KEY environment variable');
    return new Response('Error: Missing ANTHROPIC_API_KEY', { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Error: Invalid JSON body', { status: 400 });
  }

  const { text, model = 'haiku' } = body;

  if (!text || typeof text !== 'string') {
    return new Response('Error: Missing or invalid text', { status: 400 });
  }

  // Validate and map model selection to actual model IDs
  const modelMap: Record<string, string> = {
    haiku: 'claude-haiku-4-5-20251001',
    sonnet: 'claude-sonnet-4-5-20250929',
  };

  if (!modelMap[model]) {
    return new Response('Error: Invalid model. Use "haiku" or "sonnet"', { status: 400 });
  }

  const modelId = modelMap[model];

  if (text.length > 100000) {
    return new Response('Error: Text too long (max 100,000 characters)', { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  // Check if streaming is requested
  const url = new URL(req.url);
  const useStreaming = url.searchParams.get('stream') === 'true';

  if (useStreaming) {
    // Streaming response
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const stream = client.messages.stream({
            model: modelId,
            max_tokens: 16384,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: text }],
          });

          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const chunk = `data: ${JSON.stringify({ text: event.delta.text })}\n\n`;
              controller.enqueue(encoder.encode(chunk));
            }
          }

          // Signal completion
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Claude API streaming error:', error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  // Non-streaming response (backwards compatibility)
  try {
    const message = await client.messages.create({
      model: modelId,
      max_tokens: 16384,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: text }],
    });

    const improvedText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    return Response.json({ improvedText });
  } catch (error) {
    console.error('Claude API error:', error);
    return new Response('Error: AI improvement failed', { status: 500 });
  }
}
