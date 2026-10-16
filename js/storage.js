import { db } from "../firebase/firebase-config.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { state } from "./state.js";

let saveTimer;

export function salvar() {
  const uid = state.usuarioAtualUid;
  if (!uid) return;

  const snapshot = JSON.stringify(state.dbLocal);
  localStorage.setItem(`bb_mega_v20_${uid}`, snapshot);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => sincronizarComFirestore(), 500);
}

export async function sincronizarComFirestore() {
  const uid = state.usuarioAtualUid;
  if (!uid) return;
  try {
    await setDoc(doc(db, "users", uid), {
      progresso: state.dbLocal.progresso,
      blocoAtual: state.dbLocal.blocoAtual,
      cicloAtivo: state.dbLocal.cicloAtivo,
      updatedAt: serverTimestamp()
    }, { merge: true });
    const status = document.getElementById("sync-status");
    if (status) status.textContent = "Sincronizado";
  } catch (error) {
    console.error("Falha ao sincronizar o progresso.", error);
    const status = document.getElementById("sync-status");
    if (status) status.textContent = "Salvo neste dispositivo; sincronização pendente";
  }
}
