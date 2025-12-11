// Fonction principale d'analyse
async function analyzeArticle(article) {
  const prompt = `Tu es Detecto, un outil d'analyse des biais journalistiques. Analyse l'article ci-dessous pour :
- Biais politiques, émotionnels, idéologiques
- Mots connotés et tournures non neutres
- Sources citées et orientation politique si identifiable
- Frames (thèmes) : sécurité, morale, compassion, etc.
- Style d'écriture
- Score de neutralité sur 0-100 (100 = totalement neutre)

Renvoie strictement un objet JSON avec :
{
  "neutrality": 0,
  "biases": ["biais 1", "biais 2", ...],
  "connotations": [{"mot": "mot connoté", "explication": "pourquoi il est connoté"}, ...],
  "sources": [{"citation": "citation", "analyse": "analyse de la source"}, ...],
  "frames": ["frame 1", "frame 2", ...]
}

Article : ${article}`;

  try {
    // Appel Puter.js selon la doc officielle
    const response = await puter.ai.chat(prompt, {
      model: 'gemini-2.5-flash'  // ou 'gemini-3-pro-preview' pour plus de qualité
    });

    // Puter.ai.chat renvoie une chaîne de texte contenant le JSON
    return JSON.parse(response);
  } catch (error) {
    console.error("Erreur Puter:", error);
    alert("Erreur IA : l'analyse n'a pas pu être générée. Vérifie ta connexion et réessaie.");
    return null;
  }
}

// Gestion du bouton Analyser
document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const article = document.getElementById("inputText").value.trim();
  if (!article) {
    alert("Colle un article avant d’analyser.");
    return;
  }

  const loadingEl = document.getElementById("loading");
  loadingEl.classList.remove("hidden");

  try {
    const result = await analyzeArticle(article);
    loadingEl.classList.add("hidden");

    if (result) {
      document.getElementById("results").classList.remove("hidden");
      document.getElementById("neutralityScore").textContent = result.neutrality;

      // Biais
      document.getElementById("biasList").innerHTML = result.biases
        .map(b => `<li>${b}</li>`)
        .join("");

      // Mots connotés
      document.getElementById("connotationList").innerHTML = result.connotations
        .map(c => `<li><strong>${c.mot}</strong> : ${c.explication}</li>`)
        .join("");

      // Sources
      document.getElementById("sourceList").innerHTML = result.sources
        .map(s => `<li><strong>${s.citation}</strong> : ${s.analyse}</li>`)
        .join("");

      // Frames
      document.getElementById("frameList").innerHTML = result.frames
        .map(f => `<li>${f}</li>`)
        .join("");
    }
  } catch (error) {
    loadingEl.classList.add("hidden");
    console.error("Erreur générale:", error);
    alert("Erreur : impossible de générer l’analyse. Vérifie ta connexion et réessaie.");
  }
});

