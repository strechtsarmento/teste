# Licenciamento Web

## Fluxo

1. A pessoa cria uma conta com e-mail e senha.
2. O Firebase envia um link de confirmação. A conta só pode consultar a licença depois de confirmar o e-mail.
3. Na primeira entrada, informa o código de licença.
4. O app lê `chaves/{codigo}`. As regras só permitem ler o documento quando o e-mail verificado da conta corresponde exatamente ao e-mail da licença.
5. Se `status` for `ativo`, o app cria `users/{uid}` e habilita a interface.
6. Nas próximas entradas, a licença vinculada ao perfil é revalidada pelas regras do Firestore.

## Dados de licença

Cada documento `chaves/{codigo}` precisa conter `email` em letras minúsculas e `status: "ativo"`. Para suspender, altere o status para outro valor pelo console administrativo. A escrita nessa coleção fica bloqueada para o navegador.

## Segurança e limites

O código é uma referência à licença; o acesso depende da conta autenticada, do e-mail confirmado e das regras Firestore. Não há PIN de 4 a 6 dígitos nem limite confiável de dispositivos nesta versão Web. Não coloque credenciais administrativas no frontend.
