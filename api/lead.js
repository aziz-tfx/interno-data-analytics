export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { name, phone, city, lang, landing } = req.body;
        if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });

        // Build a visible language/landing tag so AmoCRM operators can tell apart
        // RU vs UZ leads and B2C vs B2B at a glance in the lead list.
        // Example results:
        //   [UZ] Aziz Toshpolatov
        //   [RU] Шахло Мафтуна
        //   [B2B-UZ] Aziz Toshpolatov · HR-direktor
        //   [B2B-RU] Шахло Мафтуна · HR-директор
        const langTag = (lang || '').toLowerCase() === 'ru' ? 'RU'
                      : (lang || '').toLowerCase() === 'uz' ? 'UZ'
                      : '';
        const isB2B = (landing || '').toLowerCase() === 'b2b';
        let prefix = '';
        if (langTag && isB2B) prefix = `[B2B-${langTag}] `;
        else if (langTag) prefix = `[${langTag}] `;
        else if (isB2B) prefix = '[B2B] ';

        const finalName = prefix + name;

        // Course/source label for the AmoCRM note — also helps the manager
        const courseLabel = isB2B ? 'Korporativ Data Analitika (B2B)' : 'Data Analitika';
        const sourceUrl = isB2B
            ? (langTag === 'RU' ? 'interno-data-analytics.vercel.app/b2b/ru' : 'interno-data-analytics.vercel.app/b2b')
            : (langTag === 'RU' ? 'interno-data-analytics.vercel.app/ru' : 'interno-data-analytics.vercel.app');

        const note = [
            'Lang: ' + (langTag || 'N/A'),
            'Landing: ' + (isB2B ? 'B2B' : 'B2C'),
            'Shahar/Kompaniya: ' + (city || 'N/A'),
            'Kurs: ' + courseLabel,
            'Manba: ' + sourceUrl,
        ].join(' | ');

        // Build multipart/form-data exactly like the AmoCRM form does
        const boundary = '----FormBoundary' + Math.random().toString(36).substring(2);

        const fields = {
            'form_id': '1581142',
            'hash': '962447f89902c84d012960cec37135fd',
            'fields[name_1]': finalName,
            'fields[875427_1][1182433]': phone,
            'fields[note_2]': note,
        };

        let body = '';
        for (const [key, value] of Object.entries(fields)) {
            body += `--${boundary}\r\n`;
            body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
            body += `${value}\r\n`;
        }
        body += `--${boundary}--\r\n`;

        const amoResponse = await fetch('https://forms.amocrm.ru/queue/add', {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Origin': 'https://forms.amocrm.ru',
                'Referer': 'https://forms.amocrm.ru/forms/html/form_1581142_962447f89902c84d012960cec37135fd.html',
            },
            body: body,
        });

        const responseText = await amoResponse.text();
        console.log('AmoCRM response:', amoResponse.status, responseText, '| name:', finalName);

        return res.status(200).json({
            success: amoResponse.ok,
            status: amoResponse.status,
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Server error', message: error.message });
    }
}
