# Arquitetura Web

- `index.html` organiza a autenticação e as telas responsivas.
- `css/` contém o estilo original aproveitado e os ajustes específicos para navegador e telas estreitas.
- `js/auth.js` implementa cadastro, login, confirmação de e-mail e validação da licença.
- `js/progresso.js`, `js/exercicios.js` e `js/ui.js` preservam as funções de estudo, exercícios e navegação.
- `js/storage.js` salva por UID no navegador e sincroniza com o Firestore.
- `firebase/firebase-config.js` inicializa o SDK público do Firebase Web; não contém credenciais administrativas.
- `firestore.rules` restringe documentos por UID, e-mail confirmado e licença ativa.
- `manifest.webmanifest` e `service-worker.js` permitem instalar a interface e manter o shell em cache.

Não há Electron, processo principal ou preload no pacote Web. A configuração do Firebase é preenchida antes de servir a página e só contém valores públicos do app Web.
