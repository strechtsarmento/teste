import { switchView, openSubject, openSubjectByTitle, showHelp } from "./ui.js";
import { check, carregarExerciciosFirebase } from "./exercicios.js";
import {
  toggleVisto, concluirTarefa, irParaEx, resetTotal, exportarProgresso,
  importarProgresso, gerarNovoBloco, renderBarra
} from "./progresso.js";
import { initializeAuth } from "./auth.js";

Object.assign(window, {
  switchView, openSubject, openSubjectByTitle, check, toggleVisto, concluirTarefa,
  irParaEx, resetTotal, exportarProgresso, importarProgresso, gerarNovoBloco,
  showHelp, renderBarra, carregarExerciciosFirebase
});

function start() {
  initializeAuth();
  const installButton = document.getElementById("btn-install-app");
  let installPrompt = null;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });
  installButton.addEventListener("click", async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.hidden = true;
  });

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.error("Não foi possível preparar o modo instalável.", error);
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
