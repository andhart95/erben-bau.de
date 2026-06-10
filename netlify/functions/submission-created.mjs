// Netlify-Trigger-Function: feuert automatisch bei jeder verifizierten Form-Submission
// (Naming-Convention "submission-created", klassisches Handler-Format lt. Netlify-Doku).
// Versand via Resend-API (fetch, keine Dependencies).
// Submissions bleiben unabhängig davon im Netlify-Dashboard gespeichert.

const RECIPIENTS = ['info@erben-bau.de', 'a.hartenfels@voyagedigital.de'];
const FROM = 'Erben Bau Kontaktformular <formular@erben-bau.de>';

export const handler = async (event) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY fehlt — Mail nicht versendet. Submission liegt im Netlify-Dashboard.');
    return { statusCode: 200, body: 'no api key' };
  }

  let data = {};
  try {
    data = JSON.parse(event.body).payload?.data ?? {};
  } catch (e) {
    console.error('Payload nicht parsebar:', e.message);
    return { statusCode: 200, body: 'bad payload' };
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
    return { statusCode: 200, body: 'mail failed' };
  }
  console.log('Kontaktanfrage-Mail versendet an', RECIPIENTS.join(', '));
  return { statusCode: 200, body: 'ok' };
};
