import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db, firebaseConfigured } from "../firebase/firebase-config.js";
import { state } from "./state.js";
import { renderConteudo, renderCiclo, renderBarra } from "./progresso.js";
import { carregarExerciciosFirebase } from "./exercicios.js";

const pendingCodeKey = "mstr_pending_license_code";
let activeUid = null;
let activationRunning = false;

function byId(id) { return document.getElementById(id); }

function message(text, kind = "info") {
  const box = byId("auth-message");
  if (!box) return;
  box.textContent = text;
  box.dataset.kind = kind;
  box.hidden = !text;
}

function showApp(show) {
  byId("auth-shell").hidden = show;
  byId("app-shell").hidden = !show;
}

function friendlyError(error) {
  const map = {
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/invalid-email": "Informe um e-mail válido.",
    "auth/email-already-in-use": "Este e-mail já tem uma conta. Entre com sua senha.",
    "auth/weak-password": "Use uma senha com pelo menos 8 caracteres.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente novamente.",
    "auth/network-request-failed": "Sem conexão. Verifique a internet e tente novamente.",
    "permission-denied": "O Firebase recusou o acesso. Confira a licença e as regras do Firestore.",
    "unavailable": "O Firebase está indisponível no momento. Tente novamente."
  };
  return map[error?.code] || "Não foi possível concluir. Confira os dados e tente novamente.";
}

function normalizedEmail() {
  return byId("auth-email").value.trim().toLowerCase();
}

async function validateLicense(user, code) {
  const cleanCode = code.trim();
  if (!cleanCode) throw new Error("Informe o código de licença fornecido pelo administrador.");
  const licenseSnap = await getDoc(doc(db, "chaves", cleanCode));
  if (!licenseSnap.exists()) throw new Error("Código de licença não encontrado.");

  const license = licenseSnap.data();
  if (license.status !== "ativo") throw new Error("Esta licença está inativa. Fale com o administrador.");
  if (String(license.email || "").trim().toLowerCase() !== user.email.toLowerCase()) {
    throw new Error("A licença está vinculada a outro e-mail.");
  }
  return cleanCode;
}

async function openLicensedSession(user, requestedCode = "") {
  if (!firebaseConfigured) {
    message("Configure firebase/firebase-config.js com os dados do app Web do Firebase antes de entrar.", "error");
    return;
  }
  if (activationRunning) return;
  activationRunning = true;
  try {
    await reload(user);
    if (!user.emailVerified) {
      showApp(false);
      byId("btn-resend-verification").hidden = false;
      message("Confirme seu e-mail pelo link enviado e depois entre novamente.", "error");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const profileSnap = await getDoc(userRef);
    const profile = profileSnap.exists() ? profileSnap.data() : null;
    const code = profile?.licenseCode || requestedCode || localStorage.getItem(pendingCodeKey) || "";
    if (!code) {
      showApp(false);
      message("Conta confirmada. Informe o código de licença para ativar o acesso.");
      return;
    }

    const licenseCode = await validateLicense(user, code);
    if (profile && profile.licenseCode !== licenseCode) {
      throw new Error("A conta já está vinculada a outra licença.");
    }

    const localKey = `bb_mega_v20_${user.uid}`;
    let localData = null;
    try { localData = JSON.parse(localStorage.getItem(localKey) || "null"); } catch { localData = null; }
    const cloudData = profile ? {
      progresso: profile.progresso || {},
      blocoAtual: Number(profile.blocoAtual || 0),
      cicloAtivo: Array.isArray(profile.cicloAtivo) ? profile.cicloAtivo : []
    } : null;
    state.dbLocal = cloudData || localData || { progresso: {}, blocoAtual: 0, cicloAtivo: [] };
    if (!state.dbLocal.progresso) state.dbLocal.progresso = {};

    if (!profile) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email.toLowerCase(),
        licenseCode,
        progresso: state.dbLocal.progresso,
        blocoAtual: state.dbLocal.blocoAtual || 0,
        cicloAtivo: state.dbLocal.cicloAtivo || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    localStorage.removeItem(pendingCodeKey);
    state.usuarioAtualUid = user.uid;
    activeUid = user.uid;
    byId("account-email").textContent = user.email;
    byId("sync-status").textContent = "Progresso sincronizado";
    showApp(true);
    renderConteudo();
    renderCiclo();
    renderBarra();
    carregarExerciciosFirebase().catch(() => {});
  } catch (error) {
    showApp(false);
    message(error?.code ? friendlyError(error) : (error.message || friendlyError(error)), "error");
  } finally {
    activationRunning = false;
  }
}

async function signIn() {
  const email = normalizedEmail();
  const password = byId("auth-password").value;
  const code = byId("auth-license").value.trim();
  if (!firebaseConfigured) return message("Configure firebase/firebase-config.js com os dados do app Web do Firebase antes de entrar.", "error");
  if (!email || !password) return message("Informe seu e-mail e sua senha.", "error");
  if (code) localStorage.setItem(pendingCodeKey, code);
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) { message(friendlyError(error), "error"); }
}

async function createAccount() {
  const email = normalizedEmail();
  const password = byId("auth-password").value;
  const code = byId("auth-license").value.trim();
  if (!firebaseConfigured) return message("Configure firebase/firebase-config.js com os dados do app Web do Firebase antes de criar a conta.", "error");
  if (!email || !password) return message("Informe seu e-mail e uma senha com pelo menos 8 caracteres.", "error");
  if (password.length < 8) return message("Use uma senha com pelo menos 8 caracteres.", "error");
  if (code) localStorage.setItem(pendingCodeKey, code);
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(credential.user);
    await signOut(auth);
    message("Conta criada. Confirme o e-mail pelo link enviado. Depois, entre e informe o código de licença.", "success");
  } catch (error) { message(friendlyError(error), "error"); }
}

async function resendVerification() {
  if (!auth.currentUser) return;
  try {
    await sendEmailVerification(auth.currentUser);
    message("Enviamos outro link de confirmação para seu e-mail.", "success");
  } catch (error) { message(friendlyError(error), "error"); }
}

async function continueCurrentSession() {
  const user = auth.currentUser;
  if (!user) return message("Entre na sua conta primeiro.", "error");
  await reload(user);
  await openLicensedSession(user, byId("auth-license").value.trim());
}

async function resetPassword() {
  const email = normalizedEmail();
  if (!email) return message("Informe seu e-mail para receber o link de redefinição.", "error");
  try {
    await sendPasswordResetEmail(auth, email);
    message("Se houver uma conta para esse e-mail, você receberá um link para redefinir a senha.", "success");
  } catch (error) { message(friendlyError(error), "error"); }
}

async function signOutUser() {
  state.usuarioAtualUid = null;
  activeUid = null;
  await signOut(auth);
  showApp(false);
  message("Você saiu da sua conta.");
}

function initializeAuth() {
  if (!firebaseConfigured) message("Antes do primeiro acesso, complete a configuração Firebase descrita no README.", "error");
  byId("btn-sign-in").addEventListener("click", signIn);
  byId("btn-create-account").addEventListener("click", createAccount);
  byId("btn-reset-password").addEventListener("click", resetPassword);
  byId("btn-resend-verification").addEventListener("click", resendVerification);
  byId("btn-continue-session").addEventListener("click", continueCurrentSession);
  byId("btn-sign-out").addEventListener("click", signOutUser);
  byId("auth-password").addEventListener("keydown", (event) => {
    if (event.key === "Enter") signIn();
  });
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      state.usuarioAtualUid = null;
      activeUid = null;
      byId("btn-resend-verification").hidden = true;
      showApp(false);
      return;
    }
    if (activeUid === user.uid && !byId("app-shell").hidden) return;
    openLicensedSession(user, byId("auth-license").value.trim());
  });
}

export { initializeAuth };
