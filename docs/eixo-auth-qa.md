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

## Risco identificado: cadastro compartilhado com Toledo

**Cadastro público intencionalmente bloqueado nesta fase.**

O Supabase do Toledo possui triggers globais sobre `auth.users`:
- `on_auth_user_created_create_laboratory_profile`
- `zz_sync_laboratory_profile_username`

A função `handle_new_laboratory_user()` cria um `laboratory_profiles` com `access_role='requester'` e `active=true` sempre que QUALQUER usuário se cadastra nesse Supabase Auth.

Se ativássemos diretamente o cadastro público do EIXO, compradores criariam também uma conta ativa no Toledo. Por segurança, as rotas de cadastro e recuperação do EIXO exigem `EIXO_REGISTRATION_ENABLED=true`, que **não está configurado** e **não deve ser ativado** no Supabase compartilhado.

### Solução recomendada

Criar um projeto Supabase Auth exclusivo para o EIXO, sem gatilhos do Toledo. Migrar para lá as tabelas `eixo_*` e conectar as variáveis de URL/chave pública novas na Railway, migrando também o recebimento de Kiwify. Somente depois ativar `EIXO_REGISTRATION_ENABLED=true`.

Outra alternativa requer revisar e alterar os triggers compartilhados do Toledo. Não executar sem análise e aprovação explícita, pois afeta outro aplicativo em produção.

## Email e primeiro acesso

Após isolar a autenticação:

1. Configurar em **Supabase Authentication → URL Configuration → Redirect URLs**:
   - `https://eixo-performance-production.up.railway.app/login?eixo=confirmado`
   - `https://eixo-performance-production.up.railway.app/login?eixo=redefinir`
2. Configurar servidor SMTP de produção próprio da marca. Os e-mails padrão Supabase têm limites e não garantem entregabilidade comercial.
3. Habilitar confirmação de e-mail.
4. Solicitar primeiro acesso; abrir o email, confirmar conta, testar login e recuperar senha.
5. Conferir que uma conta sem compra não abre `/api/eixo/member/dashboard`.
6. Confirmar que, quando a compra Kiwify aprovada corresponde ao email verificado, `eixo_claim_verified_purchase()` habilita a autorização.

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
