export async function onRequestPost({ request, env }) {
    try {
        const { contact, message } = await request.json();

        if (
            typeof contact !== "string" ||
            typeof message !== "string" ||
            !contact.trim() ||
            !message.trim()
        ) {
            return Response.json({ error: "Champs invalides." }, { status: 400 });
        }

        const words = message.trim().split(/\s+/);

        if (words.length > 500 || message.length > 4000 || contact.length > 100) {
            return Response.json({ error: "Message trop long." }, { status: 400 });
        }

       const response = await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        embeds: [{
            author: {
                name: " NOUVEAU MESSAGE",
                icon_url: "https://qmezz.pages.dev/assets/Mezz.svg"
            },
            title: "NOUVELLE CANDIDATURE",
            description: "━━━━━━━━━━━━━━━━━━━━━━",
            color: 0x000000,
            fields: [
                {
                    name: "CONTACT",
                    value: `**${contact.trim()}**`,
                    inline: false
                },
                {
                    name: "MESSAGE",
                    value: `>>> ${message.trim()}`,
                    inline: false
                }
            },
            timestamp: new Date().toISOString()
        }],
        allowed_mentions: {
            parse: []
        }
    })
});

        if (!response.ok) {
            return Response.json({ error: "Erreur Discord." }, { status: 502 });
        }

        return Response.json({ success: true });

    } catch {
        return Response.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
