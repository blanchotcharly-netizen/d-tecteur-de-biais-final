document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const article = document.getElementById("inputText").value.trim();
  if (!article) return alert("Colle un article avant d’analyser.");

  const loadingEl = document.getElementById("loading");
  loadingEl.classList.remove("hidden");

  try {
    // Appel Puter.js correctement selon la doc officielle
    const prompt = `
Tu es Detecto, un outil d'analyse des biais journalistiques.

Analyse l'article ci-dessous pour :
- Biais politiques, émotionnels, idéologiques
- Mots connotés et tournures non neutres
- Sources citées & orientation politique
- Frames thématiques (sécurité, morale, compassion, etc.)
- Score de neutralité sur 0 à 100

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

    // Ici on suit l’exemple Puter officiel : .chat() renvoie une promesse
    const response = await puter.ai.chat(prompt, { model: "google/gemini-2.5-flash" });

    // response est un string JSON, on parse
    const result = JSON.parse(response);

    loadingEl.classList.add("hidden");
    document.getElementById("results").classList.remove("hidden");

    document.getElementById("neutralityScore").textContent = result.neutrality + "%";
    document.getElementById("biasList").innerHTML = result.biases.map(b => `<li>${b}</li>`).join("");
    document.getElementById("connotationList").innerHTML =
      result.connotations.map(c => `<li><strong>${c.mot}</strong> : ${c.explication}</li>`).join("");
    document.getElementById("sourceList").innerHTML =
      result.sources.map(s => `<li><strong>${s.citation}</strong> : ${s.analyse}</li>`).join("");
    document.getElementById("frameList").innerHTML =
      result.frames.map(f => `<li>${f}</li>`).join("");

  } catch (error) {
    loadingEl.classList.add("hidden");
    console.error("Erreur Puter:", error);
    alert("Erreur IA : impossible de générer l'analyse. Vérifie ta connexion et réessaie.");
  }
});

