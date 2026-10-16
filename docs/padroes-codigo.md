# Padrões da versão Web

- Mantenha o projeto estático e compatível com hospedagem GitHub Pages em subpasta.
- Use caminhos relativos para scripts, estilos, manifest e service worker.
- Nunca coloque chaves de service account, tokens administrativos ou chaves de e-mail no frontend.
- Vincule o progresso à UID autenticada; não use o código de licença como identificador de usuário.
- Preserve a validação de licença nas regras do Firestore, não apenas na interface.
- Ao alterar os arquivos em cache, incremente a versão em `service-worker.js`.
- Teste conta sem verificação, licença inativa e acesso por outro UID antes de publicar mudanças nas regras.
