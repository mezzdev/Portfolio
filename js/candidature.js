const contactForm = document.getElementById("contact-form");
const messageInput = document.getElementById("message");
const contactInput = document.getElementById("video-url");
const wordCount = document.getElementById("word-count");

contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const button = contactForm.querySelector(".send-button");

    button.disabled = true;
    button.textContent = "ENVOI EN COURS...";

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contact: contactInput.value,
                message: messageInput.value
            })
        });

        const text = await response.text();
        console.log("Réponse du serveur :", response.status, text);

        const result = text ? JSON.parse(text) : {};

        if (!response.ok) {
            throw new Error(result.error || "Erreur lors de l'envoi.");
        }

        alert("Message envoyé !");

        contactForm.reset();
        wordCount.textContent = "0";

    } catch (error) {
        alert(error.message);
    } finally {
        button.disabled = false;
        button.textContent = "ENVOYER";
    }
});
