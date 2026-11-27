# ADR-0006 — Eventos públicos por curadoria manual e CSV, sem raspagem

- **Status:** aceita (27/11/2026)
- **Contexto:** o portal e os dados abertos da CCEE bloqueiam acesso automatizado (HTTP 403 / "acesso bloqueado", D-001, anexo H5). Tribunais têm termos próprios.
- **Decisão:** no MVP, os eventos entram por formulário de curadoria ou por importação CSV, sempre com URL da fonte. A série de FA entra por CSV baixado manualmente. Não há robô que contorne bloqueio.
- **Por quê:** contornar um bloqueio explícito traz risco jurídico e reputacional, e a curadoria humana com dupla checagem é a própria proposta de valor (precisão > volume).
- **Gatilho de revisão:** se a CCEE oferecer API ou termos de uso que permitam coleta, ou se o volume de curadoria passar de 2 h/dia.
