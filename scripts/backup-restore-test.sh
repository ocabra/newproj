#!/usr/bin/env bash
# Teste de backup e restauração (docs/09 §6): pg_dump do banco de DATABASE_URL, restaura num banco temporário
# e compara contagens de linhas de todas as tabelas. Requer pg_dump/psql no PATH.
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -z "${DATABASE_URL:-}" ] && [ -f .env ]; then set -a; . ./.env; set +a; fi
: "${DATABASE_URL:?DATABASE_URL ausente}"
base="${DATABASE_URL%/*}"
tmpdb="radar_restore_$(date +%s)"
dump="$(mktemp -t radar-backup-XXXXXX.dump)"
trap 'psql "$base/postgres" -qc "drop database if exists $tmpdb" >/dev/null 2>&1 || true; rm -f "$dump"' EXIT
pg_dump --format=custom --no-owner "$DATABASE_URL" -f "$dump"
psql "$base/postgres" -qc "create database $tmpdb" >/dev/null
# pg_dump ≥ 17 emite SET transaction_timeout, desconhecido por servidores 16: filtrado.
pg_restore --no-owner -f - "$dump" | sed '/^SET transaction_timeout/d' | psql -q -v ON_ERROR_STOP=1 "$base/$tmpdb" >/dev/null
q="select string_agg(table_name || '=' || (xpath('/row/c/text()', query_to_xml('select count(*) c from '||quote_ident(table_name), false, true, '')))[1]::text, ' ' order by table_name) from information_schema.tables where table_schema='public'"
a="$(psql "$DATABASE_URL" -Atc "$q")"
b="$(psql "$base/$tmpdb" -Atc "$q")"
if [ "$a" = "$b" ]; then echo "OK: restauração confere ($a)"; else echo "FALHA: origem [$a] != restaurado [$b]"; exit 1; fi
