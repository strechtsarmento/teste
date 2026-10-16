# Firestore Web

## Coleções usadas

- `chaves/{codigo}`: criada e administrada fora do cliente Web. Campos: `email` e `status`.
- `users/{uid}`: perfil privado por UID autenticado, contendo `licenseCode`, `email`, `progresso`, `blocoAtual`, `cicloAtivo` e datas de criação/atualização.
- `exercicios/{id}`: conteúdo somente leitura para contas autenticadas com licença ativa.

## Regras

Publique o arquivo `firestore.rules` no Firebase Console ou Firebase CLI. As regras impedem leitura geral de licenças, listagem de perfis e alterações de licença pelo navegador. Elas só devem ser ativadas após conferir os campos de licença existentes no projeto.

Use regras e dados deste pacote em um **projeto Firebase Web separado**. Aplicá-las ao projeto atual bloqueia as operações do app Linux, que não usa Firebase Authentication.

As regras da coleção `chaves` comparam o e-mail da conta autenticada com o campo `email` exatamente. Padronize os e-mails de licença em letras minúsculas.
