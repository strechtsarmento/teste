import { incidenciaGeral, incidenciasDetalhadas, temas } from "./config.js";
import { state } from "./state.js";
import { salvar } from "./storage.js";
import { getDiffDays, getExerciseSubjectMeta } from "./utils.js";
import { getStatusRev } from "./revisoes.js";
import { switchView, openSubject } from "./ui.js";
import { carregarExerciciosFirebase } from "./exercicios.js";
import { escapeHtml } from "./utils.js";

export function sortearMateria() {
    let totalPeso = Object.values(incidenciaGeral).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalPeso;
    for (let mat in incidenciaGeral) {
        if (random < incidenciaGeral[mat]) return mat;
        random -= incidenciaGeral[mat];
    }
    return "CONHECIMENTOS BANCARIOS";
}

export function sortearTema(materia) {
    let temasDisponiveis = temas[materia].filter(t => !state.dbLocal.progresso[t]?.visto);
    if (temasDisponiveis.length === 0) return temas[materia][0];
    return temasDisponiveis[Math.floor(Math.random() * temasDisponiveis.length)];
}

export function gerarNovoBloco() {
    state.dbLocal.blocoAtual++;
    let novos = [], revs = [];
    for (let mat in temas) {
        temas[mat].forEach(t => {
            if (!state.dbLocal.progresso[t]) state.dbLocal.progresso[t] = { visto: false };
            let p = state.dbLocal.progresso[t];
            if (!p.visto) novos.push({ mat, t, tipo: "NOVO" });
            else {
                if (!p.r1) revs.push({ mat, t, tipo: "R1" });
                else if (!p.r7 && getDiffDays(new Date(p.dataVisto + 7*86400000), new Date()) <= 0) revs.push({ mat, t, tipo: "R7" });
                else if (!p.r30 && getDiffDays(new Date(p.dataVisto + 30*86400000), new Date()) <= 0) revs.push({ mat, t, tipo: "R30" });
            }
        });
    }
    novos.sort(() => Math.random() - 0.5);
    revs.sort(() => Math.random() - 0.5);

    let bloco = [];
    if (revs.length > 0 && (state.dbLocal.blocoAtual % 2 === 0 || revs.length > 3)) {
        let m1 = sortearMateria(); let t1 = sortearTema(m1);
        if(t1) bloco.push({ mat: m1, t: t1, label: "Período 1", tipo: "NOVO" });
        if(novos[0]) bloco.push({...novos[0], label: "Período 2"});
        bloco.push({...revs[0], label: "Revisão"});
    } else {
        for(let i=1; i<=3; i++) {
            let m = sortearMateria(); let t = sortearTema(m);
            if(t) bloco.push({ mat: m, t: t, label: "Período "+i, tipo: "NOVO" });
        }
    }
    state.dbLocal.cicloAtivo = bloco; salvar(); renderCiclo();
}

export function concluirTarefa(idx) {
    let it = state.dbLocal.cicloAtivo[idx];
    if (it.tipo === "NOVO" || !it.tipo) {
        if (!state.dbLocal.progresso[it.t]) state.dbLocal.progresso[it.t] = {};
        state.dbLocal.progresso[it.t].visto = true;
        state.dbLocal.progresso[it.t].dataVisto = Date.now();
    } else {
        state.dbLocal.progresso[it.t][it.tipo.toLowerCase()] = true;
    }
    state.dbLocal.cicloAtivo.splice(idx, 1);
    salvar();
    renderConteudo();
    renderCiclo();
    renderBarra();
}

export function renderConteudo() {
    const tg = document.getElementById("tooltip-geral");
    if (tg) {
        tg.innerHTML = `<h4>Incidência Geral das Disciplinas</h4><table class="stats">` +
            Object.entries(incidenciaGeral).map(([k,v]) => `<tr><td>${k}</td><td class="val">${v}%</td></tr>`).join('') + `</table>`;
    }

    const cont = document.getElementById("conteudo");
    if (!cont) return;
    cont.innerHTML = "";

    for (let mat in temas) {
        let div = document.createElement("div");
        div.className = "materia";
        let det = incidenciasDetalhadas[mat] || [["Geral", "100%"]];
        let tableHtml = `<table class="stats">` + det.map(r => `<tr><td>${r[0]}</td><td class="val">${r[1]}</td></tr>`).join('') + `</table>`;

        div.innerHTML = `<div class="tooltip-container"><div class="subject-title-wrap"><h3 style="color:var(--secondary)">${mat}</h3><div class="tooltip-data"><h4>📈 Incidência de Assuntos - ${mat}</h4>${tableHtml}</div></div></div><div class="lista"></div>`;
        const lista = div.querySelector(".lista");

        temas[mat].forEach(t => {
            if (!state.dbLocal.progresso[t]) state.dbLocal.progresso[t] = { visto: false, dataVisto: null, r1: false, r7: false, r30: false };
            const r1 = state.dbLocal.progresso[t].visto ? getStatusRev(t, 0, 'r1') : null;
            const r7 = state.dbLocal.progresso[t].visto ? getStatusRev(t, 7, 'r7') : null;
            const r30 = state.dbLocal.progresso[t].visto ? getStatusRev(t, 30, 'r30') : null;

            let card = document.createElement("div");
            card.className = `card ${state.dbLocal.progresso[t].visto ? 'visto' : ''}`;
            card.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center"><b>${t}</b><input type="checkbox" ${state.dbLocal.progresso[t].visto?'checked':''} onchange="toggleVisto('${t}')"></div>${state.dbLocal.progresso[t].visto ? `<div class="rev-section"><span class="rev-title">Revisões</span><div class="rev-status-box"><span class="badge-rev ${r1.class}">R1: ${r1.text}</span><span class="badge-rev ${r7.class}">R7: ${r7.text}</span><span class="badge-rev ${r30.class}">R30: ${r30.text}</span></div></div>` : ''}`;
            lista.appendChild(card);
        });
        cont.appendChild(div);
    }
}

export function toggleVisto(t) {
    if (!state.dbLocal.progresso[t]) state.dbLocal.progresso[t] = { visto: false, dataVisto: null, r1: false, r7: false, r30: false };
    if (state.dbLocal.progresso[t].visto) {
        const confirmar = confirm("Tem certeza que deseja remover este assunto do progresso?\n\nAs revisões serão apagadas e o tema voltará para a fila dos blocos.");
        if (!confirmar) { renderConteudo(); return; }
        state.dbLocal.progresso[t] = { visto: false, dataVisto: null, r1: false, r7: false, r30: false };
    } else {
        state.dbLocal.progresso[t] = { visto: true, dataVisto: Date.now(), r1: false, r7: false, r30: false };
    }
    salvar();
    renderConteudo();
    renderBarra();
}

export function renderCiclo() {
    const l = document.getElementById("cicloLista");
    if (!l) return;
    const items = Array.isArray(state.dbLocal.cicloAtivo) ? state.dbLocal.cicloAtivo : [];
    l.innerHTML = items.length ? "" : "<p>Gere um bloco.</p>";
    items.forEach((item, idx) => {
        if (!item || typeof item !== "object") return;
        let isRev = item.tipo !== "NOVO" && item.tipo !== undefined;
        l.innerHTML += `
            <div class="ciclo-card ${isRev?'is-rev':''}">
                <small style="color:var(--secondary)"><b>${escapeHtml(item.label || "Tarefa")} ${isRev?'('+escapeHtml(item.tipo)+')':''}</b></small><br>
                <input type="checkbox" data-cycle-index="${idx}"> <b>${escapeHtml(item.mat || "")}</b><br>
                <span style="font-size:11px; margin-left:22px">${escapeHtml(item.t || "")}</span><br>
                <button class="btn-atalho-q" data-subject="${escapeHtml(item.mat || "")}">📝 Praticar Exercícios</button>
            </div>`;
    });
    l.querySelectorAll("input[data-cycle-index]").forEach((input) => {
        input.addEventListener("change", () => concluirTarefa(Number(input.dataset.cycleIndex)));
    });
    l.querySelectorAll(".btn-atalho-q[data-subject]").forEach((button) => {
        button.addEventListener("click", () => irParaEx(button.dataset.subject));
    });
}

export async function irParaEx(matNome) {
    switchView(
        "view-exercicios",
        document.getElementById("nav-ex-tab")
    );

    await carregarExerciciosFirebase();

    const targetId = getExerciseSubjectMeta(matNome).id;

    if (!targetId) return;

    const btn = document.querySelector(
        `.nav-btn-ex[data-subject-id="${targetId}"]`
    );

    openSubject(targetId, btn);
}

export function exportarProgresso() {
    const dados = JSON.stringify(state.dbLocal, null, 2);
    const blob = new Blob([dados], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_estudos_bb_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert("Backup concluído com sucesso!");
}

export function importarProgresso(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importado = JSON.parse(e.target.result);
            if (importado.progresso && typeof importado.progresso === "object" && !Array.isArray(importado.progresso)) {
                const allowedTopics = new Set(Object.values(temas).flat());
                const progressoSeguro = Object.fromEntries(Object.entries(importado.progresso)
                    .filter(([topic, value]) => allowedTopics.has(topic) && value && typeof value === "object" && !Array.isArray(value))
                    .map(([topic, value]) => [topic, {
                        visto: Boolean(value.visto),
                        dataVisto: Number.isFinite(Number(value.dataVisto)) ? Number(value.dataVisto) : null,
                        r1: Boolean(value.r1), r7: Boolean(value.r7), r30: Boolean(value.r30)
                    }]));
                const cicloSeguro = Array.isArray(importado.cicloAtivo) ? importado.cicloAtivo
                    .filter(item => item && typeof item === "object" && typeof item.mat === "string" && typeof item.t === "string")
                    .map(item => ({
                        mat: item.mat.slice(0, 100),
                        t: item.t.slice(0, 160),
                        label: typeof item.label === "string" ? item.label.slice(0, 40) : "Tarefa",
                        tipo: ["NOVO", "R1", "R7", "R30"].includes(item.tipo) ? item.tipo : "NOVO"
                    })) : [];
                state.dbLocal = {
                    progresso: progressoSeguro,
                    blocoAtual: Number.isFinite(Number(importado.blocoAtual)) ? Math.max(0, Number(importado.blocoAtual)) : 0,
                    cicloAtivo: cicloSeguro
                };
                salvar();
                renderConteudo();
                renderCiclo();
                renderBarra();
                alert("Backup restaurado com sucesso!");
            } else { alert("Ficheiro inválido."); }
        } catch (err) { alert("Erro ao ler o arquivo."); }
    };
    reader.readAsText(file);
}

export function resetTotal() {
    if (confirm("⚠️ Isto apagará TODO o teu progresso. Continuar?")) {
        state.dbLocal = { progresso: {}, blocoAtual: 0, cicloAtivo: [] };
        salvar();
        renderConteudo();
        renderCiclo();
        carregarExerciciosFirebase().catch(() => {});
        renderBarra();
    }
}

export function renderBarra() {
    if (!state.dbLocal || !state.dbLocal.progresso) {
        state.dbLocal = { progresso: {}, blocoAtual: 0, cicloAtivo: [] };
    }
    let total = 0;
    let feitos = 0;

    for (let mat in temas) {
        temas[mat].forEach(t => {
            total++;
            if (state.dbLocal.progresso[t] && state.dbLocal.progresso[t].visto) feitos++;
        });
    }

    const porcentagem = total > 0 ? Math.round((feitos / total) * 100) : 0;
    const pBar = document.getElementById("progress"); if (pBar) { pBar.style.setProperty("width", porcentagem + "%", "important"); pBar.style.display = "block"; }
    const pDashText = document.getElementById("dashboard-progress-text"); if (pDashText) pDashText.innerText = `Você já viu ${porcentagem}% do conteúdo`;
}
