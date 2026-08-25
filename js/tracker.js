const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1541155099894743081/qTVHCu4hV6c9AMBjC5B4DvPKIHmLW1o_o72Ovxad0TmfqyPmkGnGeCTB__FAM3DdWbwn";

async function getVisitorInfo() {
    const userAgent = navigator.userAgent;
    let browser = 'Inconnu';

    if (userAgent.includes('Edg/')) browser = 'Microsoft Edge';
    else if (userAgent.includes('OPR/') || userAgent.includes('Opera')) browser = 'Opera';
    else if (userAgent.includes('Vivaldi/')) browser = 'Vivaldi';
    else if (userAgent.includes('SamsungBrowser/')) browser = 'Samsung Internet';
    else if (userAgent.includes('Firefox/')) browser = 'Mozilla Firefox';
    else if (userAgent.includes('CriOS/')) browser = 'Chrome iOS';
    else if (userAgent.includes('FxiOS/')) browser = 'Firefox iOS';
    else if (userAgent.includes('Chrome/')) browser = 'Google Chrome';
    else if (userAgent.includes('Safari/')) browser = 'Safari';

    let os = 'Inconnu';

    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
    else if (userAgent.includes('Mac OS X')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';

    return {
        page: window.location.href,
        browser,
        os,
        resolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        date: new Date().toLocaleString('fr-FR', {
            timeZone: 'Europe/Paris'
        })
    };
}

async function trackVisit() {
    try {
        const visitor = await getVisitorInfo();

        // Envoi à ton API
        await fetch('/api/visit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(visitor),
            keepalive: true
        });

        // Envoi directement à Discord
        await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                embeds: [{
                    title: 'Nouveau visiteur',
                    color: 0x5865F2,
                    fields: [
                        {
                            name: 'Page',
                            value: visitor.page,
                            inline: false
                        },
                        {
                            name: 'Navigateur',
                            value: visitor.browser,
                            inline: true
                        },
                        {
                            name: 'OS',
                            value: visitor.os,
                            inline: true
                        },
                        {
                            name: 'Résolution',
                            value: visitor.resolution,
                            inline: true
                        },
                        {
                            name: 'Langue',
                            value: visitor.language,
                            inline: true
                        },
                        {
                            name: 'Date',
                            value: visitor.date,
                            inline: false
                        }
                    ]
                }]
            }),
            keepalive: true
        });

    } catch (error) {
        console.error('Erreur du tracker :', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackVisit, {
        once: true
    });
} else {
    trackVisit();
}
