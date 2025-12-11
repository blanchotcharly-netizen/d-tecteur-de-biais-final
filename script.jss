async function analyzeArticle(article) {
    const prompt = `
Tu es un outil d’analyse journalistique avancé.

Analyse l’article ci-dessous pour détecter :
- Biais politiques, émotionnels, idéologiques
- Mots connotés et tournures non neutres
- Sources citées et orientation politique si identifiable
- Frames (ex : sécurité, menace, moralisation, compassion, etc.)
- Style d’écriture
- Score de neutralité sur 0-100 (100 = totalement neutre)

Réponds strictement en JSON :
{
  "neutrality": 0,
  "biases": ["..."],
  "connotations": [{ "mot": "...", "explication": "..." }],
  "sources": [{ "citation": "...", "analyse": "..." }],
  "frames": ["..."]
}

Article :
"""${article}"""
`;

    try {
        const response = await puter.ai.chat(prompt, { model: "gemini-3-pro-preview" });
        return JSON.parse(response);
    } catch (err) {
        console.error("Erreur Puter:", err);
        alert("Erreur IA : l’IA n’a pas pu répondre. Réessaie plus tard.");
        return null;
    }
}

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const article = document.getElementById("inputText").value.trim();
    if (!article) return alert("Colle un article avant d’analyser.");

    const loadingEl = document.getElementById("loading");
    loadingEl.classList.remove("hidden");

    const result = await analyzeArticle(article);

    loadingEl.classList.add("hidden");

    if (result) {
        document.getElementById("results").classList.remove("hidden");
        document.getElementById("neutralityScore").textContent = result.neutrality + "%";
        document.getElementById("biasList").innerHTML = result.biases.map(b => `<li>${b}</li>`).join("");
        document.getElementById("connotationList").innerHTML =
            result.connotations.map(c => `<li><strong>${c.mot}</strong> : ${c.explication}</li>`).join("");
        document.getElementById("sourceList").innerHTML =
            result.sources.map(s => `<li><strong>${s.citation}</strong> : ${s.analyse}</li>`).join("");
        document.getElementById("frameList").innerHTML =
            result.frames.map(f => `<li>${f}</li>`).join("");
    }
});
