// Estado mutável centralizado do aplicativo.
export const state = {
  dbLocal: { progresso: {}, blocoAtual: 0, cicloAtivo: [] },
  usuarioAtualUid: null,
  exerciciosCache: null,
  exerciciosLoadingPromise: null
};

if (!state.dbLocal.progresso) state.dbLocal.progresso = {};
