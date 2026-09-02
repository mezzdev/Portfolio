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

    let ip = 'Inconnue';
    let city = 'Inconnue';
    let country = 'Inconnu';

    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();

        ip = ipData.ip;

        const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const locationData = await locationResponse.json();

        city = locationData.city || 'Inconnue';
        country = locationData.country_name || 'Inconnu';
    } catch (error) {
        console.error('❌ Impossible de récupérer les informations réseau :', error);
    }

    return {
        page: window.location.href,
        browser,
        os,
        ip,
        city,
        country,
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

        await fetch('/api/visit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(visitor),
            keepalive: true
        });

        await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                embeds: [{
                    title: '👀 Nouveau visiteur',
                    color: 0x5865F2,

                    fields: [
                        {
                            name: '🌐 Adresse IP',
                            value: `\`${visitor.ip}\``,
                            inline: false
                        },
                        {
                            name: '📍 Localisation',
                            value: `${visitor.city}, ${visitor.country}`,
                            inline: false
                        },
                        {
                            name: '📄 Page',
                            value: visitor.page,
                            inline: false
                        },
                        {
                            name: '🌍 Navigateur',
                            value: visitor.browser,
                            inline: true
                        },
                        {
                            name: '💻 OS',
                            value: visitor.os,
                            inline: true
                        },
                        {
                            name: '🖥️ Résolution',
                            value: visitor.resolution,
                            inline: true
                        },
                        {
                            name: '🗣️ Langue',
                            value: visitor.language,
                            inline: true
                        },
                        {
                            name: '🕐 Date',
                            value: visitor.date,
                            inline: false
                        }
                    ],

                    footer: {
                        text: 'Tracker du site de Hiro 67'
                    },

                    timestamp: new Date().toISOString()
                }]
            }),
            keepalive: true
        });

        console.log(`%c

----------------------------------------------------
        
      ▄▀▀▀▀▄▄▀▀▄   ▄▀▀▀▀▀█  ▄▀▀▀▀▄   ▄▀▀▀▀▄ 
      █          █ █      ▓ █      █ █      █
      █  ░   ░   █ █  █▀▀▀▀ ▀▀▀▄  ▄▀ ▀▀▀▄  ▄▀
      ▓  ░   ░   █ ▓  █▄█▄▄  ▄▀  ▀▄▄  ▄▀  ▀▄▄
      ▒  ▒   ▒   ▓ ▒      ▒ ▒      ▒ ▒      ▒
      ▒▄▄▓ ▄▄▓ ▄▄▒  ▀▄▄▄▄▄█  ▀▄▄▄▄▄█  ▀▄▄▄▄▄█

-----------------------------------------------------

Developper of this website : https://guns.lol/opvault_net
`, "color: #00ff66; font-weight: bold;");


    } catch (error) {
        console.error('❌ Erreur du tracker :', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackVisit, {
        once: true
    });
} else {
    trackVisit();
}
