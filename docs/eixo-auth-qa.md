# Método EIXO — Autenticação, Kiwify e validação

Atualizado em 18/11/2026.

## URLs

- Landing page: `https://eixo-performance-production.up.railway.app/`
- Login: `https://eixo-performance-production.up.railway.app/login`
- Área de alunos: `https://eixo-performance-production.up.railway.app/app`
- Kiwify webhook: `https://eixo-performance-production.up.railway.app/api/eixo/kiwify/webhook`
- Member content: `/api/eixo/member/dashboard` (exige sessão válida e assinatura ativa)
- Member progress: `/api/eixo/member/progress` (exige sessão válida e assinatura ativa)

## Banco do Supabase

Foi reutilizado o projeto **toledo-reports**, sem alterações na sua estrutura de negócios.
Tabelas próprias do EIXO:

- `public.eixo_purchases` — eventos de pagamento, sem SELECT público.
- `public.eixo_memberships` — direitos de acesso, leitura apenas pelo próprio usuário.
- `public.eixo_day_progress` — marcação de 7 dias, RLS restrita ao proprietário autenticado e autorizado.

Funções dedicadas:

- `public.eixo_apply_kiwify_event` — internal-only: conceder/revogar compras aprovadas, estornadas e com chargeback; executável apenas pela service role.
- `public.eixo_claim_verified_purchase` — verifica email confirmado de `auth.uid()`, relaciona compra aprovada e ativa a autorização somente para aquele usuário.

Edge Function: `eixo-kiwify-ingest` — valida segredo de integração e chama RPC de compra.

## Isolamento do cadastro EIXO (18/11/2026)

A autenticação ainda utiliza o projeto Supabase compartilhado com Toledo Reports. Por segurança, o trigger `on_auth_user_created_create_laboratory_profile`, em `auth.users`, passou a executar `handle_new_laboratory_user()` **apenas quando** `NEW.raw_user_meta_data->>'app' IS DISTINCT FROM 'eixo'`.

- Cadastros normais do Toledo seguem criando seu perfil como antes; a função `handle_new_laboratory_user()` não foi modificada.
- Cadastros do EIXO enviam `data:{app:'eixo'}` na operação `/auth/v1/signup`. Assim, o trigger do Toledo não gera nenhum perfil de laboratório.
- Esse metadado **não** concede acesso ao EIXO. As tabelas de autorização e compras continuam independentes e protegidas por RLS.
- O segundo trigger, `zz_sync_laboratory_profile_username`, permanece intacto e ignora cadastros EIXO sem `username`.

**Teste lógico:** a condição do trigger retorna false para `app=eixo`, true para `app=toledo` e true na ausência de app. A entrega de e-mail de confirmação e o novo cadastro completo ainda precisam de teste real de ponta a ponta.

Para isolamento total, especialmente antes de grande volume de vendas, continua recomendável um projeto Supabase Auth exclusivo para o EIXO. A criação de um projeto novo depende de orçamento e aprovação do usuário.

## Cadastro e confirmação de e-mail

O fluxo público agora é:

1. Na tela `/login`, escolher **Criar cadastro**.
2. Informar e-mail, senha e **confirmar a senha**. As duas senhas precisam coincidir.
3. A aplicação chama `/api/eixo/auth/register`, que cria usuário com metadado EIXO e `redirect_to=https://eixo-performance-production.up.railway.app/login?eixo=acesso`.
4. Após receber o e-mail de confirmação (caso confirmação por e-mail esteja ativada no Supabase), clicar no link.
5. `/login` processa o fragmento do link e envia os tokens para `/api/eixo/auth/complete-email`; o servidor valida a conta diretamente com GoTrue.
6. Se a confirmação for válida e o link for de `signup`, a tela exibe a mensagem positiva **Cadastro confirmado com sucesso! Agora entre com seu e-mail e a senha que você criou.** Não há login automático nessa etapa.
7. O login posterior exige compra aprovada do EIXO ou autorização de teste explicitamente cadastrada.

A interface não impõe quantidade mínima personalizada de caracteres. **O Supabase Auth mantém sua política de segurança**, que costuma exigir no mínimo seis caracteres; senhas rejeitadas são explicadas ao usuário.

**Atenção:** um e-mail já cadastrado e confirmado no Supabase compartilhado não pode criar uma segunda conta via signup. Para testar cadastro de novo aluno, usar um endereço ainda não existente no Supabase. Não excluir ou modificar conta do Toledo para fazer o teste.

**Supabase Authentication → URL Configuration → Redirect URLs:** deixar cadastrada `https://eixo-performance-production.up.railway.app/login?eixo=acesso`. Não mudar o Site URL global do Toledo por causa do EIXO.

No Supabase, verificar que o provedor Email está ativo e que **Confirm email** está habilitado. Confirmar também política de SMTP e eventuais limites de envio; para produção recomenda-se SMTP próprio.

### Testes pendentes

- [ ] Cadastro de e-mail novo; conferir que `auth.users.raw_user_meta_data->>'app'='eixo'`.
- [ ] Conferir ausência de `laboratory_profiles` para a conta EIXO.
- [ ] Recebimento real do e-mail, clique no link e mensagem positiva.
- [ ] Login com senha após confirmação.
- [ ] Bloqueio da área paga quando ainda não existe compra autorizada.
- [ ] Após compra aprovada no webhook, login autorizado e progresso individual.

## Kiwify

Webhook exige assinatura HMAC SHA-1 em `?signature=` sobre o JSON original e segredo em `EIXO_KIWIFY_WEBHOOK_TOKEN`. Uma requisição sem assinatura recebeu 401 no teste de segurança.

O evento só é processado se corresponder ao produto Método EIXO ou, preferencialmente, ao `EIXO_KIWIFY_PRODUCT_ID` cadastrado. Definir este último na Railway quando for conhecido (não confiar apenas no nome do produto).

A Kiwify pode reenviar eventos e exige HTTP 2xx; a conciliação é idempotente por identificador da venda e não deve reviver compra já estornada por reenvio.

### Checklist de validação de pagamento

- [ ] Teste real enviado pelo painel de webhooks da Kiwify e evidência HTTP 2xx nos logs.
- [ ] Inserção correspondente em `eixo_purchases` com `status='approved'`.
- [ ] Email do comprador confirmado na autenticação isolada.
- [ ] Compra reconhecida e `eixo_memberships.status='active'`.
- [ ] Login liberado e `/app` acessível.
- [ ] Progresso do dia salvo em `eixo_day_progress`.
- [ ] Evento de reembolso ou chargeback revoga o acesso; acesso negado em nova consulta.
- [ ] Evento de outro produto não concede acesso ao EIXO.

**Observação:** sem webhook recebido e sem um e-mail confirmado de teste, nenhum desses passos positivos foi validado de ponta a ponta. Nunca declarar checkout, e-mail entregue ou confirmação testados sem evidência.
