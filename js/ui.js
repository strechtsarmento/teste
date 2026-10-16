import { carregarExerciciosFirebase } from "./exercicios.js";
import { getExerciseSubjectMeta } from "./utils.js";

export function switchView(viewId, element) {
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none';
    });

    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.remove('active');
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
        targetView.style.display = 'block';
    }

    if (element) {
        element.classList.add('active');
    }

    if (viewId === 'view-exercicios') {
        carregarExerciciosFirebase().catch(() => {});
    }

    document.body.style.overflow = 'auto';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function switchViewIfExists(viewId, element) {
    if (document.getElementById(viewId)) {
        switchView(viewId, element);
    }
}

export function openSubject(id, btn) {
    document.querySelectorAll('.subject-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn-ex').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(id);
    if(target) {
        target.classList.add('active');
        target.scrollTop = 0;
    }

    if(btn) {
        btn.classList.add('active');
    }
}

export function openSubjectByTitle(title) {
    if (!title) return;
    const targetId = getExerciseSubjectMeta(title).id;

    if (targetId) {
        const buttons = document.querySelectorAll('.nav-btn-ex');
        let targetBtn = null;
        for (let btn of buttons) {
            const inlineHandler = btn.getAttribute('onclick') || '';
            if (btn.dataset.subjectId === targetId || inlineHandler.includes(targetId)) {
                targetBtn = btn; break;
            }
        }
        if (targetBtn) openSubject(targetId, targetBtn);
    }
}

export function showHelp(id, btn) {
    document.querySelectorAll('.help-content').forEach(c => {
        c.classList.remove('active');
        c.style.display = 'none';
    });
    document.querySelectorAll('.help-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById('h-content-' + id);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }
    if (btn) btn.classList.add('active');

    if (id === 6 || id === '6') {
        const inpAtual = document.getElementById("input-pin-atual");
        const divErro = document.getElementById("msg-erro-pin");
        const divSucesso = document.getElementById("msg-sucesso-pin");
        if (divErro) divErro.style.display = "none";
        if (divSucesso) divSucesso.style.display = "none";
        setTimeout(() => { if (inpAtual) inpAtual.focus(); }, 50);
    }
}
