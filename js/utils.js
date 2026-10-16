import { EXERCISE_SUBJECTS_MAP } from "./config.js";

export function normalizeExerciseText(value) {
    return (value || "")
        .toString()
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function escapeJsString(value) {
    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}

export function getExerciseSubjectMeta(subjectName) {
    const key = normalizeExerciseText(subjectName);
    return EXERCISE_SUBJECTS_MAP[key] || {
        key: key || "SEM_MATERIA",
        id: `ex-${(key || "sem-materia").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        label: subjectName || "Sem materia"
    };
}

export function compareExerciseIds(a, b) {
    const aNumber = Number(String(a.id || "").replace(/\D+/g, ""));
    const bNumber = Number(String(b.id || "").replace(/\D+/g, ""));

    if (!Number.isNaN(aNumber) && !Number.isNaN(bNumber) && aNumber !== bNumber) {
        return aNumber - bNumber;
    }

    return String(a.id || "").localeCompare(String(b.id || ""), "pt-BR", { numeric: true });
}

export function getDiffDays(d1, d2) {
    return Math.round((new Date(d1).setHours(0,0,0,0) - new Date(d2).setHours(0,0,0,0)) / 86400000);
}
