// Mail-Versand fürs Kontaktformular via Resend (formular@erben-bau.de).
// Wird vom Formular-Script direkt aufgerufen (POST, JSON), NICHT über Netlifys
// submission-created-Trigger — der feuert auf diesem Team nachweislich nicht (still geblockt).
// Die Submission selbst wird unabhängig davon von Netlify Forms gespeichert (Dashboard-Backup).

const RECIPIENTS = ['info@erben-bau.de', 'a.hartenfels@voyagedigital.de'];
const FROM = 'Erben Bau Kontaktformular <formular@erben-bau.de>';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'method not allowed' };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY fehlt — Mail nicht versendet. Submission liegt im Netlify-Dashboard.');
    return { statusCode: 200, body: 'no api key' };
  }

  let data = {};
  try {
    data = JSON.parse(event.body);
  } catch (e) {
    console.error('Payload nicht parsebar:', e.message);
    return { statusCode: 400, body: 'bad payload' };
  }

  // Honeypot: Bots füllen das versteckte Feld — still verwerfen
  if (data['bot-field']) {
    console.log('Honeypot ausgelöst — keine Mail versendet.');
    return { statusCode: 200, body: 'ok' };
  }

  const lines = [
    `Name:        ${data['Name'] ?? '—'}`,
    `E-Mail:      ${data['Email'] ?? '—'}`,
    `Unternehmen: ${data['Unternehmen'] ?? '—'}`,
    `Telefon:     ${data['Telefon'] ?? '—'}`,
    '',
    'Anliegen:',
    data['Ihr-Anliegen'] ?? '—',
    '',
    '—',
    'Diese Anfrage kam über das Kontaktformular auf www.erben-bau.de.',
    'Alle Anfragen liegen zusätzlich im Netlify-Dashboard (Projekt erben-bau → Forms).',
  ];

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: RECIPIENTS,
      reply_to: data['Email'] || undefined,
      subject: `Neue Kontaktanfrage: ${data['Name'] ?? 'ohne Name'}`,
      text: lines.join('\n'),
    }),
  });

  if (!res.ok) {
    console.error('Resend-Fehler', res.status, await res.text());
    return { statusCode: 502, body: 'mail failed' };
  }
  console.log('Kontaktanfrage-Mail versendet an', RECIPIENTS.join(', '));
  return { statusCode: 200, body: 'ok' };
};
