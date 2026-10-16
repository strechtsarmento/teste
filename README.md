# Master Dashboard BB — versão Web

Aplicativo responsivo para navegador, com instalação opcional como PWA. O app Linux original permanece separado e não é alterado por este pacote.

## O que está incluído

- Painel de estudos, ciclos, revisões, exercícios, backup e restauração.
- Layout adaptável para computador, tablet e celular.
- Cadastro e login com Firebase Authentication por e-mail e senha.
- Confirmação de e-mail, redefinição de senha e validação de licença.
- Progresso salvo no Firestore e cópia local por conta neste navegador.
- Manifesto e service worker para instalar a interface como PWA.

A interface instalável pode abrir sem rede, mas login, validação de licença, exercícios e sincronização precisam de conexão com o Firebase.

## Antes de publicar

1. Crie um **projeto Firebase separado para a versão Web**. Não substitua as regras Firestore do projeto atual: isso interromperia o app Linux, que usa outro fluxo de acesso.
2. No projeto Web, configure um app Web, Authentication por e-mail/senha e um banco Firestore.
3. Substitua os valores `CONFIGURE_*` em `firebase/firebase-config.js` pelos dados do app Web.
4. No Authentication, confirme os domínios autorizados usados pela página, incluindo `SEU_USUARIO.github.io`.
5. Publique as regras de `firestore.rules` **somente no projeto Firebase Web**.
6. Cadastre as licenças Web em `chaves/{CODIGO}` com `email` em letras minúsculas e `status: "ativo"`. O e-mail deve ser o mesmo usado na conta Web.
7. Copie para o projeto Web os documentos de exercícios necessários. Não há migração automática dos dados do Firestore desktop.
8. Teste com uma conta e licença de teste, incluindo e-mail não confirmado, licença inativa e conta sem licença.
9. Publique a pasta inteira deste projeto em uma branch/repositório apropriado e ative GitHub Pages.

O app não requer um servidor próprio para login. A chave privada de service account do Firebase e chaves da Brevo **não pertencem** a este site. Nunca coloque esses arquivos no pacote web, em variáveis JS, ou no repositório público.

Use o arquivo `firestore.rules` apenas no projeto Firebase dedicado à Web. O app Linux permanece usando o projeto e as regras atuais.

## Executar localmente

Sirva esta pasta por um servidor HTTP local (por exemplo, a extensão Live Server do VS Code). Abrir `index.html` como arquivo local não funciona para módulos JavaScript, service worker ou Firebase.

## Estrutura

- `index.html`, `css/`, `js/`: interface e lógica do navegador.
- `firebase/firebase-config.js`: configuração pública do SDK Web do Firebase.
- `firestore.rules`: regras para licença, perfil e exercícios.
- `manifest.webmanifest`, `service-worker.js`: instalação PWA e cache da interface.

## Limitações conhecidas

- O limite antigo de dois dispositivos era baseado no identificador local do Electron; não é copiado para o navegador. Um limite confiável no navegador requer lógica de servidor confiável.
- O PIN local do app desktop foi substituído por senha Firebase e confirmação de e-mail.
- O progresso da instalação desktop não é migrado automaticamente. Use **Baixar backup** no app antigo e **Carregar backup** na versão Web.
- O banco de exercícios permanece somente leitura e depende dos documentos existentes em `exercicios`.
