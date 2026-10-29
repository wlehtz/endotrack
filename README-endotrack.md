# 🩺 EndoTrack

Plataforma web para acompanhamento de sintomas de endometriose: registro de
dor, histórico em gráficos e conteúdo de apoio, com ajuda de IA da Replit no
desenvolvimento.

🔗 **Ver ao vivo:** [endotrack-alpha.vercel.app](https://endotrack-alpha.vercel.app)

## Funcionalidades

- **Login simples** por nome de usuário, com opção de criar uma conta demo já
  populada com dados de exemplo.
- **Registro de dor** — localização, intensidade (escala de 1 a 10) e descrição.
- **Histórico em gráfico** — evolução da intensidade da dor ao longo do tempo,
  usando Chart.js, com até 30 registros recentes.
- **Dashboard** — total de registros, dias desde o último e intensidade média.
- **Conteúdo educativo** — o que é a endometriose, sintomas comuns e dicas de
  cuidado (relaxamento, calor, alimentação, hidratação).
- **Assistente por chat** com respostas que variam de acordo com o plano.
- **Planos** — Gratuito, Premium (R$ 29,90/mês) e Profissional (R$ 49,90/mês),
  cada um liberando mais recursos (consultas online, relatórios, etc).

Todos os dados ficam salvos no `localStorage` do navegador, por usuário —
não há backend.

## Como rodar localmente

Não há build nem dependências — é só abrir o `index.html` no navegador.

## Tecnologias

- HTML5, CSS3 e JavaScript
- [Chart.js](https://www.chartjs.org/) para os gráficos de evolução

## Trabalho acadêmico

Este projeto foi desenvolvido e entregue como trabalho de uma disciplina da
faculdade, com apoio de IA (Replit) no desenvolvimento.

### Integrantes

| Nome                      | RA       |
| ------------------------- | -------- |
| Letícia Fantucci Medina   | 47592974 |
| Gustavo Figueiredo Soares | 46834796 |
| Mateus Alves Gouveia      | 45742561 |
