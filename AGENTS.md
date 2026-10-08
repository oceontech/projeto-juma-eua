# AGENTS.md

## Contas e CLIs

- Este projeto usa os tokens de `.claude/settings.local.json`, que valem só para esta pasta (GitHub: `oceontech`; Vercel: time `oceon`).
- Nunca rodar `gh auth login`, `supabase login` ou `vercel login`, nem alterar configurações globais (git, gh, supabase, vercel).
- Todo comando da Vercel usa `--token $VERCEL_TOKEN` e o escopo da conta deste projeto: `--scope team_jsF9ervoTl8eJv5RwbwjQAlC` (time `oceon`). No PowerShell, use `$env:VERCEL_TOKEN`.
- Nunca exibir, registrar ou commitar tokens.
