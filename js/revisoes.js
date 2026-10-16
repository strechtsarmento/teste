import { state } from "./state.js";
import { getDiffDays } from "./utils.js";

export function getStatusRev(t, dias, key) {
    if (state.dbLocal.progresso[t][key]) return { class: 'rev-concluida', text: 'OK' };
    let alvo = new Date(state.dbLocal.progresso[t].dataVisto);
    alvo.setDate(alvo.getDate() + dias);
    let diff = getDiffDays(alvo, new Date());
    if (diff < 0) return { class: 'rev-atrasada', text: diff + 'd' };
    if (diff === 0) return { class: 'rev-hoje', text: 'HOJE' };
    return { class: 'rev-futura', text: diff + 'd' };
}
