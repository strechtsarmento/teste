import { db } from "../firebase/firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { EXERCISE_SUBJECTS } from "./config.js";
import { state } from "./state.js";
import { escapeHtml, getExerciseSubjectMeta, compareExerciseIds } from "./utils.js";

export function ensureExerciseShell() {
    const view = document.getElementById("view-exercicios");
    if (!view) return null;

    if (!view.dataset.dynamicExercisesReady) {
        view.innerHTML = `
            <div class="simulado-container">
                <div id="sidebar-ex">
                    <h3 style="margin-top:0">Disciplinas</h3>
                    <div id="exercise-nav-list">
                        <p style="color:#888; font-size:13px;">Carregando disciplinas...</p>
                    </div>
                </div>
                <div id="main-ex">
                    <div class="subject-section active">
                        <h2>Banco de Exercicios</h2>
                        <p style="color:#888;">Carregando exercicios do Firebase...</p>
                    </div>
                </div>
            </div>
        `;
        view.dataset.dynamicExercisesReady = "true";
    }

    return view;
}

export function renderExerciseCard(exercise, indexInSubject) {
    const rawCardId = String(exercise.id || `q-${indexInSubject + 1}`);
    const htmlCardId = escapeHtml(rawCardId);
    const answer = String(exercise.correta || "").trim().toUpperCase();
    const statement = escapeHtml(exercise.enunciado || "Enunciado indisponivel.");
    const options = exercise.alternativas || {};
    const letters = Object.keys(options).sort();

    const optionsHtml = letters.map((letter) => {
        const upperLetter = escapeHtml(letter.toUpperCase());
        const text = escapeHtml(options[letter]);
        return `<label class="opt" data-l="${upperLetter}"><input type="radio" name="r_${htmlCardId}" value="${upperLetter}"> ${upperLetter}) ${text}</label>`;
    }).join("");

    return `
        <div class="q-card" id="${htmlCardId}">
            <span class="q-num">QUESTAO ${indexInSubject + 1}</span>
            <p>${statement}</p>
            <div class="options">${optionsHtml}</div>
            <button class="verify-btn" data-exercise-id="${htmlCardId}" data-answer="${escapeHtml(answer)}">Verificar Gabarito</button>
        </div>
    `;
}

export function renderExerciseSections(exercisesBySubject) {
    ensureExerciseShell();

    const navList = document.getElementById("exercise-nav-list");
    const mainEx = document.getElementById("main-ex");
    if (!navList || !mainEx) return;

    navList.innerHTML = "";
    mainEx.innerHTML = "";

    EXERCISE_SUBJECTS.forEach((subject, index) => {
        const exercises = exercisesBySubject[subject.key] || [];
        const button = document.createElement("button");
        button.className = `nav-btn-ex ${index === 0 ? "active" : ""}`;
        button.dataset.subjectId = subject.id;
        button.textContent = subject.label;
        button.onclick = function () { window.openSubject(subject.id, this); };
        navList.appendChild(button);

        const section = document.createElement("div");
        section.id = subject.id;
        section.className = `subject-section ${index === 0 ? "active" : ""}`;

        if (exercises.length === 0) {
            section.innerHTML = `<h2>${escapeHtml(subject.label)}</h2><p style="color:#888;">Nenhum exercicio encontrado para esta disciplina no Firebase.</p>`;
        } else {
            section.innerHTML = `<h2>${escapeHtml(subject.label)}</h2>${exercises.map((exercise, idx) => renderExerciseCard(exercise, idx)).join("")}`;
        }

        mainEx.appendChild(section);
    });

    if (!mainEx.dataset.answerHandlerReady) {
        mainEx.dataset.answerHandlerReady = "true";
        mainEx.addEventListener("click", (event) => {
            const button = event.target.closest(".verify-btn[data-exercise-id]");
            if (button && mainEx.contains(button)) check(button.dataset.exerciseId, button.dataset.answer);
        });
    }
}

export async function carregarExerciciosFirebase(forceReload = false) {
    ensureExerciseShell();

    if (state.exerciciosCache && !forceReload) {
        renderExerciseSections(state.exerciciosCache);
        return state.exerciciosCache;
    }

    if (state.exerciciosLoadingPromise && !forceReload) {
        return state.exerciciosLoadingPromise;
    }

    const navList = document.getElementById("exercise-nav-list");
    const mainEx = document.getElementById("main-ex");
    if (navList) navList.innerHTML = `<p style="color:#888; font-size:13px;">Carregando disciplinas...</p>`;
    if (mainEx) {
        mainEx.innerHTML = `<div class="subject-section active"><h2>Banco de Exercicios</h2><p style="color:#888;">Buscando dados no Firebase...</p></div>`;
    }

    state.exerciciosLoadingPromise = (async () => {
        try {
            const snapshot = await getDocs(collection(db, "exercicios"));
            const grouped = Object.fromEntries(EXERCISE_SUBJECTS.map((subject) => [subject.key, []]));

            snapshot.forEach((docSnap) => {
                const data = docSnap.data() || {};
                const subject = getExerciseSubjectMeta(data.materia);
                const exercise = {
                    firestoreDocId: docSnap.id,
                    id: data.id || docSnap.id,
                    materia: data.materia || subject.label,
                    enunciado: data.enunciado || "",
                    correta: data.correta || "",
                    alternativas: data.alternativas || {}
                };

                if (!grouped[subject.key]) grouped[subject.key] = [];
                grouped[subject.key].push(exercise);
            });

            Object.values(grouped).forEach((list) => list.sort(compareExerciseIds));

            state.exerciciosCache = grouped;
            renderExerciseSections(grouped);
            return grouped;
        } catch (error) {
            console.error("Erro ao carregar exercicios do Firebase:", error);
            if (navList) navList.innerHTML = `<p style="color:#ff6b6b; font-size:13px;">Falha ao carregar.</p>`;
            if (mainEx) {
                mainEx.innerHTML = `
                    <div class="subject-section active">
                        <h2>Banco de Exercicios</h2>
                        <p style="color:#ff6b6b;">Nao foi possivel buscar os exercicios no Firebase.</p>
                        <p style="color:#888;">Detalhe: ${escapeHtml(error.message || "erro desconhecido")}</p>
                    </div>
                `;
            }
            throw error;
        } finally {
            state.exerciciosLoadingPromise = null;
        }
    })();

    return state.exerciciosLoadingPromise;
}

export function check(cardId, correctLetter) {
    const card = document.getElementById(cardId);
    const selected = card.querySelector('input:checked');
    if(!selected) { alert('Selecione uma opção!'); return; }
    const options = card.querySelectorAll('.opt');
    options.forEach(opt => {
        opt.classList.remove('correct', 'wrong');
        const letter = opt.getAttribute('data-l');
        if(letter === correctLetter) opt.classList.add('correct');
        if(selected.value === letter && selected.value !== correctLetter) opt.classList.add('wrong');
    });
}
