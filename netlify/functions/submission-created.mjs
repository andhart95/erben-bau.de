// Netlify-Trigger-Function: feuert automatisch bei jeder verifizierten Form-Submission
// (Naming-Convention "submission-created"). Versand via Resend-API (fetch, keine Dependencies).
// Submissions bleiben unabhängig davon im Netlify-Dashboard gespeichert.

const RECIPIENTS = ['info@erben-bau.de', 'a.hartenfels@voyagedigital.de'];
const FROM = 'Erben Bau Kontaktformular <formular@erben-bau.de>';

export default async (request) => {
  const apiKey = process.env.RESEND_API_KEY;
  const { payload } = await request.json();
  const data = payload?.data ?? {};

  if (!apiKey) {
    console.error('RESEND_API_KEY fehlt — Mail nicht versendet. Submission liegt im Netlify-Dashboard.');
    return new Response('no api key', { status: 200 });
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
    return new Response('mail failed', { status: 200 });
  }
  console.log('Kontaktanfrage-Mail versendet an', RECIPIENTS.join(', '));
  return new Response('ok', { status: 200 });
};
