// Variáveis globais
let usuarioAtual = null;
let planoAtual = 'free';

// Funções de navegação
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');

  // Adicionar overlay quando sidebar estiver aberta no mobile
  if (window.innerWidth <= 768) {
    let overlay = document.querySelector('.sidebar-overlay');
    if (sidebar.classList.contains('open')) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.onclick = () => {
          sidebar.classList.remove('open');
          overlay.remove();
        };
        document.body.appendChild(overlay);
      }
    } else if (overlay) {
      overlay.remove();
    }
  }
}

function showSection(sectionId) {
  // Verificar se usuário está logado (exceto para login)
  if (!usuarioAtual && sectionId !== 'login') {
    mostrarNotificacao('Faça login para acessar esta área', 'error');
    return;
  }

  const sections = document.querySelectorAll('.main');
  sections.forEach(section => {
    section.classList.add('hidden');
    section.style.display = 'none';
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    targetSection.style.display = 'block';

    // Animação suave de entrada
    setTimeout(() => {
      targetSection.style.opacity = '0';
      targetSection.style.transform = 'translateY(20px)';
      targetSection.style.transition = 'all 0.3s ease';

      requestAnimationFrame(() => {
        targetSection.style.opacity = '1';
        targetSection.style.transform = 'translateY(0)';
      });
    }, 10);
  }

  // Carregar conteúdo específico da seção
  switch(sectionId) {
    case 'home':
      atualizarDashboard();
      break;
    case 'historico':
      atualizarHistorico();
      break;
    case 'consultas':
      carregarConsultas();
      break;
    case 'relatorios':
      carregarRelatorios();
      break;
    case 'comunidade':
      carregarComunidade();
      break;
    case 'premium':
      carregarAreaPremium();
      break;
    case 'professional':
      carregarAreaProfessional();
      break;
  }

  // Fechar sidebar no mobile
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('open');
  }
}

// Sistema de login/logout
function fazerLogin() {
  const username = document.getElementById('username').value.trim();
  if (!username) {
    mostrarNotificacao('Por favor, digite um nome de usuário', 'error');
    return;
  }

  usuarioAtual = username;
  planoAtual = localStorage.getItem(`plano_${username}`) || 'free';

  localStorage.setItem('usuarioAtual', username);

  atualizarInfoUsuario();
  
  // Esconder login
  const loginSection = document.getElementById('login');
  loginSection.classList.add('hidden');
  loginSection.style.display = 'none';
  
  // Mostrar página inicial
  const homeSection = document.getElementById('home');
  homeSection.classList.remove('hidden');
  homeSection.style.display = 'block';

  atualizarInterfacePremium();
  atualizarHistorico();
  mostrarNotificacao(`Bem-vinda, ${username}!`, 'success');
}

function criarContaDemo() {
  const nomes = ['Ana Silva', 'Maria Santos', 'Carla Oliveira', 'Julia Costa', 'Fernanda Lima'];
  const nomeDemo = nomes[Math.floor(Math.random() * nomes.length)];

  // Adicionar alguns dados de demonstração
  const dadosDemo = [
    {
      id: Date.now() - 86400000,
      data: new Date(Date.now() - 86400000).toISOString(),
      local: 'Abdômen inferior',
      intensidade: 7,
      descricao: 'Dor intensa tipo cólica, começou de manhã'
    },
    {
      id: Date.now() - 172800000,
      data: new Date(Date.now() - 172800000).toISOString(),
      local: 'Região lombar',
      intensidade: 5,
      descricao: 'Dor constante, piorou à tarde'
    },
    {
      id: Date.now() - 259200000,
      data: new Date(Date.now() - 259200000).toISOString(),
      local: 'Ovários',
      intensidade: 8,
      descricao: 'Dor latejante, muito incômoda'
    }
  ];

  localStorage.setItem(`registrosDor_${nomeDemo}`, JSON.stringify(dadosDemo));

  document.getElementById('username').value = nomeDemo;
  fazerLogin();

  mostrarNotificacao('Conta demonstrativa criada com dados de exemplo!', 'success');
}

function fazerLogout() {
  localStorage.removeItem('usuarioAtual');
  usuarioAtual = null;
  planoAtual = 'free';

  document.getElementById('userInfo').innerHTML = '';
  document.getElementById('userPlanInfo').innerHTML = '';
  document.getElementById('login').classList.remove('hidden');
  document.getElementById('home').classList.add('hidden');

  document.querySelectorAll('.main').forEach(el => {
    if (el.id !== 'login') el.classList.add('hidden');
  });
  
  showSection('login');
}

function atualizarInfoUsuario() {
  const userInfo = document.getElementById('userInfo');
  const planInfo = document.getElementById('userPlanInfo');

  const planNames = {
    'free': 'Gratuito',
    'premium': 'Premium',
    'professional': 'Profissional'
  };

  userInfo.innerHTML = `
    Usuário: ${usuarioAtual} 
    <button onclick="fazerLogout()" style="margin-left: 10px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Sair</button>
  `;

  planInfo.innerHTML = `
    <div>
      <strong>Plano: ${planNames[planoAtual]}</strong>
      ${planoAtual === 'free' ? '<br><small>Faça upgrade para acessar mais recursos</small>' : ''}
    </div>
  `;

  // Atualizar status do chat
  const chatStatus = document.getElementById('chatStatus');
  if (chatStatus) {
    chatStatus.textContent = planoAtual === 'free' ? 'Gratuita' : 
                             planoAtual === 'premium' ? 'Premium' : 'Profissional';
  }
}

// Sistema de planos
function assinarPlano(tipoPiano) {
  if (!usuarioAtual) {
    mostrarNotificacao('Por favor, faça login primeiro', 'error');
    return;
  }

  // Simulação de processo de pagamento
  const planNames = {
    'premium': 'Premium (R$ 29,90/mês)',
    'professional': 'Profissional (R$ 49,90/mês)'
  };

  if (confirm(`Deseja assinar o plano ${planNames[tipoPiano]}?\n\n(Esta é uma simulação - nenhum pagamento real será processado)`)) {
    planoAtual = tipoPiano;
    localStorage.setItem(`plano_${usuarioAtual}`, tipoPiano);

    atualizarInfoUsuario();
    mostrarNotificacao(`Parabéns! Plano ${planNames[tipoPiano]} ativado com sucesso!`, 'success');

    // Atualizar interface para mostrar recursos premium
    atualizarInterfacePremium();
  }
}

function atualizarInterfacePremium() {
  // Atualizar botões de plano
  document.querySelectorAll('.plan-btn').forEach(btn => {
    btn.disabled = false;
    btn.textContent = btn.textContent.replace('Plano Atual', 'Selecionar');
    btn.classList.remove('current-plan');
  });

  // Marcar plano atual
  const currentPlanBtn = document.querySelector(`.${planoAtual}-btn`);
  if (currentPlanBtn) {
    currentPlanBtn.disabled = true;
    currentPlanBtn.textContent = 'Plano Atual';
    currentPlanBtn.classList.add('current-plan');
  }

  // Atualizar conteúdo das seções premium se necessário
  if (planoAtual !== 'free') {
    atualizarConteudoPremium();
  }
}

function atualizarConteudoPremium() {
  // Simulação de conteúdo premium
  const consultasContent = document.getElementById('consultasContent');
  const relatoriosContent = document.getElementById('relatoriosContent');
  const comunidadeContent = document.getElementById('comunidadeContent');

  if (planoAtual === 'premium' || planoAtual === 'professional') {
    consultasContent.innerHTML = `
      <div class="premium-content">
        <h3>Consultas Disponíveis</h3>
        <div class="consulta-card">
          <h4>Dra. Maria Silva - Ginecologista</h4>
          <p>Especialista em endometriose - 15 anos de experiência</p>
          <button class="primary-btn">Agendar Consulta</button>
        </div>
        <div class="consulta-card">
          <h4>Dr. João Santos - Cirurgião</h4>
          <p>Especialista em cirurgia minimamente invasiva</p>
          <button class="primary-btn">Agendar Consulta</button>
        </div>
      </div>
    `;

    relatoriosContent.innerHTML = `
      <div class="premium-content">
        <h3>Seus Relatórios Personalizados</h3>
        <div class="relatorio-card">
          <h4>Análise de Padrões de Dor</h4>
          <p>Relatório detalhado dos últimos 30 dias com insights sobre seus sintomas</p>
          <button class="primary-btn">Gerar Relatório</button>
        </div>
        <div class="relatorio-card">
          <h4>Relatório para Médico</h4>
          <p>Documento profissional para levar à sua consulta médica</p>
          <button class="primary-btn">Baixar PDF</button>
        </div>
      </div>
    `;

    comunidadeContent.innerHTML = `
      <div class="premium-content">
        <h3>Comunidade Exclusiva</h3>
        <div class="comunidade-card">
          <h4>💬 Grupo de Apoio Semanal</h4>
          <p>Participe de conversas moderadas por psicólogos especializados</p>
          <button class="primary-btn">Entrar no Grupo</button>
        </div>
        <div class="comunidade-card">
          <h4>📚 Biblioteca de Recursos</h4>
          <p>Acesso exclusivo a artigos científicos e guias especializados</p>
          <button class="primary-btn">Acessar Biblioteca</button>
        </div>
      </div>
    `;
  }
}

// Funções Premium
function agendarConsulta() {
  if (planoAtual === 'free') {
    mostrarNotificacao('Funcionalidade disponível apenas para planos Premium', 'warning');
    showSection('planos');
    return;
  }

  mostrarNotificacao('🩺 Redirecionando para agenda de consultas...', 'success');
  // Simular abertura de modal de agendamento
  setTimeout(() => {
    alert('Sistema de agendamento integrado\n\nEspecialistas disponíveis:\n• Dra. Maria Silva - Disponível hoje às 15h\n• Dr. João Santos - Disponível amanhã às 10h\n\nClique para agendar!');
  }, 1000);
}

function gerarRelatorio() {
  if (planoAtual === 'free') {
    mostrarNotificacao('Funcionalidade disponível apenas para planos Premium', 'warning');
    showSection('planos');
    return;
  }

  mostrarNotificacao('📊 Gerando relatório personalizado...', 'success');
  setTimeout(() => {
    alert('Relatório Gerado!\n\nResumo dos últimos 30 dias:\n• 12 registros de dor\n• Intensidade média: 6.2/10\n• Padrão identificado: Picos durante período menstrual\n• Recomendação: Consulta com especialista\n\nRelatório salvo em PDF!');
  }, 1500);
}

function acessarComunidade() {
  if (planoAtual === 'free') {
    mostrarNotificacao('Funcionalidade disponível apenas para planos Premium', 'warning');
    showSection('planos');
    return;
  }

  mostrarNotificacao('👥 Conectando à comunidade exclusiva...', 'success');
  setTimeout(() => {
    alert('Bem-vinda à Comunidade EndoTrack!\n\n🔴 AO VIVO: "Lidando com dor crônica" - Dr. Pedro Lima\n\n💬 Grupos ativos:\n• Nutrição para Endometriose (47 membros online)\n• Apoio Emocional (23 membros online)\n• Exercícios e Fisioterapia (15 membros online)\n\nClique para participar!');
  }, 1000);
}

function montarEquipe() {
  if (planoAtual !== 'professional') {
    mostrarNotificacao('Funcionalidade disponível apenas para plano Profissional', 'warning');
    showSection('planos');
    return;
  }

  mostrarNotificacao('🏥 Montando sua equipe multidisciplinar...', 'success');
  setTimeout(() => {
    alert('Equipe Profissional Montada!\n\n👩‍⚕️ Ginecologista: Dra. Ana Martins\n🧠 Psicóloga: Dra. Carla Souza\n🥗 Nutricionista: Dr. Rafael Lima\n💊 Farmacêutica Clínica: Dra. Julia Santos\n\nPróxima reunião de equipe: Sexta-feira às 14h\nTodos os especialistas têm acesso ao seu histórico!');
  }, 2000);
}

function solicitarExame() {
  if (planoAtual !== 'professional') {
    mostrarNotificacao('Funcionalidade disponível apenas para plano Profissional', 'warning');
    showSection('planos');
    return;
  }

  mostrarNotificacao('🔬 Processando solicitação de exame...', 'success');
  setTimeout(() => {
    alert('Exames Solicitados!\n\n📋 Seu plano inclui:\n• Ultrassom transvaginal - Agendado para amanhã às 9h\n• Dosagem hormonal completa - Coleta hoje até 16h\n• Ressonância magnética - Agendada para próxima semana\n\nResultados serão analisados pela sua equipe e enviados em 48h!');
  }, 1500);
}

function conectarInternacional() {
  if (planoAtual !== 'professional') {
    mostrarNotificacao('Funcionalidade disponível apenas para plano Profissional', 'warning');
    showSection('planos');
    return;
  }

  mostrarNotificacao('🌍 Conectando com rede internacional...', 'success');
  setTimeout(() => {
    alert('Conexão Internacional Estabelecida!\n\n🇺🇸 Dr. Michael Johnson (Johns Hopkins) - Disponível\n🇫🇷 Dra. Sophie Martin (Sorbonne) - Disponível\n🇬🇧 Dr. James Wilson (Imperial College) - Disponível\n\n💡 Tratamento experimental disponível:\n"Nova terapia hormonal com 87% de eficácia"\n\nDeseja agendar segunda opinião?');
  }, 2000);
}

// Sistema de registro de dor
function updateIntensidade() {
  const range = document.getElementById('intensidadeRange');
  const value = document.getElementById('intensidadeValue');
  const desc = document.getElementById('intensidadeDesc');
  const hidden = document.getElementById('intensidade');

  const descriptions = {
    1: 'Muito Leve',
    2: 'Leve', 
    3: 'Leve-Moderada',
    4: 'Moderada',
    5: 'Moderada',
    6: 'Moderada-Forte',
    7: 'Forte',
    8: 'Muito Forte',
    9: 'Severa',
    10: 'Insuportável'
  };

  value.textContent = range.value;
  desc.textContent = descriptions[range.value];
  hidden.value = range.value;
}

function registrarDor() {
  if (!usuarioAtual) {
    mostrarNotificacao('Por favor, faça login primeiro', 'error');
    return;
  }

  const local = document.getElementById('local').value.trim();
  const intensidade = document.getElementById('intensidade').value;
  const descricao = document.getElementById('descricao').value.trim();

  if (!local || !intensidade || !descricao) {
    mostrarNotificacao('Por favor, preencha todos os campos', 'error');
    return;
  }

  const registro = {
    id: Date.now(),
    data: new Date().toISOString(),
    local,
    intensidade: Number(intensidade),
    descricao
  };

  let registros = JSON.parse(localStorage.getItem(`registrosDor_${usuarioAtual}`) || '[]');
  registros.push(registro);
  localStorage.setItem(`registrosDor_${usuarioAtual}`, JSON.stringify(registros));

  // Limpar campos
  document.getElementById('local').value = '';
  document.getElementById('intensidadeRange').value = '5';
  document.getElementById('intensidade').value = '5';
  document.getElementById('intensidadeValue').textContent = '5';
  document.getElementById('intensidadeDesc').textContent = 'Moderada';
  document.getElementById('descricao').value = '';

  mostrarNotificacao('✅ Dor registrada com sucesso!', 'success');
  atualizarHistorico();
}

// Sistema de histórico
function atualizarHistorico() {
  if (!usuarioAtual) return;

  const historicoContainer = document.querySelector('.historico-container');
  if (!historicoContainer) return;

  const registros = JSON.parse(localStorage.getItem(`registrosDor_${usuarioAtual}`) || '[]')
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  // Atualizar gráfico
  atualizarGrafico(registros);

  // Atualizar lista de registros
  if (registros.length === 0) {
    historicoContainer.innerHTML = '<p style="text-align: center; color: #666; margin: 2rem 0;">Nenhum registro de dor ainda. Comece registrando sua primeira dor!</p>';
    return;
  }

  historicoContainer.innerHTML = registros.map((reg, index) => {
    const dataFormatada = new Date(reg.data).toLocaleString('pt-BR');
    const intensidadeClass = reg.intensidade <= 3 ? 'leve' : reg.intensidade <= 6 ? 'moderada' : 'forte';

    return `
      <div class="registro ${intensidadeClass}">
        <button class="delete-btn" onclick="excluirRegistro('${reg.id}')" title="Excluir registro">×</button>
        <div class="registro-header">
          <strong>📅 ${dataFormatada}</strong>
          <span class="intensidade-badge intensidade-${reg.intensidade}">
            ${reg.intensidade}/10
          </span>
        </div>
        <p><strong>📍 Local:</strong> ${reg.local}</p>
        <p><strong>📝 Descrição:</strong> ${reg.descricao}</p>
      </div>
    `;
  }).join('');
}

function atualizarGrafico(registros) {
  atualizarGraficoSeguro(registros);
}

function excluirRegistro(registroId) {
  if (!usuarioAtual) return;

  if (!confirm('Deseja realmente excluir este registro?')) return;

  let registros = JSON.parse(localStorage.getItem(`registrosDor_${usuarioAtual}`) || '[]');
  registros = registros.filter(reg => reg.id != registroId);

  localStorage.setItem(`registrosDor_${usuarioAtual}`, JSON.stringify(registros));

  mostrarNotificacao('🗑️ Registro excluído com sucesso!', 'success');
  atualizarHistorico();
}

// Sistema de chat
function toggleChat() {
  const chatBox = document.getElementById('chatBox');
  const isVisible = chatBox.style.display === 'flex';
  chatBox.style.display = isVisible ? 'none' : 'flex';

  if (!isVisible && !chatBox.hasAttribute('data-initialized')) {
    inicializarChat();
    chatBox.setAttribute('data-initialized', 'true');
  }
}

function inicializarChat() {
  const chatMessages = document.getElementById('chatMessages');
  const tipoPlano = usuarioAtual ? planoAtual : 'free';

  let mensagemInicial = '';
  if (tipoPlano === 'professional') {
    mensagemInicial = '🩺 <strong>Endo IA Profissional:</strong> Olá! Tenho acesso a dados médicos avançados e posso te ajudar com análises detalhadas. Como posso ajudar hoje?';
  } else if (tipoPlano === 'premium') {
    mensagemInicial = '⭐ <strong>Endo IA Premium:</strong> Oi! Tenho informações especializadas sobre endometriose. Posso te ajudar com dúvidas específicas sobre sintomas e tratamentos.';
  } else {
    mensagemInicial = '🤖 <strong>Endo IA:</strong> Olá! Posso responder dúvidas básicas sobre endometriose. Para análises mais detalhadas, considere fazer upgrade para Premium.';
  }

  chatMessages.innerHTML = `<div class="ai-message initial">${mensagemInicial}</div>`;
}

function enviarMensagem() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();

  if (!msg) return;

  const chatMessages = document.getElementById('chatMessages');

  // Adicionar mensagem do usuário
  chatMessages.innerHTML += `<div class="user-message"><strong>Você:</strong> ${msg}</div>`;

  // Mostrar indicador de digitação
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';
  typingIndicator.innerHTML = '<span class="loading-spinner"></span>Endo IA está digitando...';
  chatMessages.appendChild(typingIndicator);

  // Simular resposta da IA baseada no plano
  setTimeout(() => {
    typingIndicator.remove();

    const tipoPlano = usuarioAtual ? planoAtual : 'free';
    const resposta = gerarRespostaIA(msg, tipoPlano);

    chatMessages.innerHTML += `<div class="ai-message"><strong>Endo IA:</strong> ${resposta}</div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 1500);

  input.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function gerarRespostaIA(mensagem, plano) {
  const palavrasChave = mensagem.toLowerCase();

  if (plano === 'professional') {
    if (palavrasChave.includes('dor')) {
      return 'Com base em estudos clínicos, a dor endometriósica pode ser classificada em nociceptiva, neuropática e central. Recomendo uma avaliação multidisciplinar com escala VAS para quantificação precisa.';
    }
    if (palavrasChave.includes('tratamento')) {
      return 'Protocolos atuais incluem terapia hormonal combinada, cirurgia laparoscópica conservadora e abordagem integrativa. Posso conectar você com especialistas em nossa rede global.';
    }
    return 'Como usuária Profissional, posso fornecer análises baseadas em evidências científicas e conectar você com nossa rede de especialistas internacionais.';
  }

  if (plano === 'premium') {
    if (palavrasChave.includes('dor')) {
      return 'A dor endometriósica varia em intensidade e localização. Recomendo manter um diário detalhado e considerar técnicas de manejo como mindfulness e fisioterapia pélvica.';
    }
    if (palavrasChave.includes('sintomas')) {
      return 'Os sintomas podem incluir dismenorreia, dispareunia, fadiga e alterações intestinais. Cada caso é único - posso ajudar a identificar padrões em seus registros.';
    }
    return 'Como usuária Premium, tenho acesso a informações especializadas sobre endometriose. Posso te ajudar com análises personalizadas dos seus sintomas.';
  }

  // Respostas básicas para plano gratuito
  const respostasBasicas = [
    'A endometriose é uma condição complexa que requer acompanhamento médico especializado.',
    'Manter registros regulares dos sintomas pode ajudar muito no diagnóstico e tratamento.',
    'Recomendo conversar com um ginecologista especializado em endometriose.',
    'Para respostas mais detalhadas e personalizadas, considere fazer upgrade para Premium.',
    'Técnicas de relaxamento e exercícios leves podem ajudar no manejo dos sintomas.'
  ];

  return respostasBasicas[Math.floor(Math.random() * respostasBasicas.length)];
}

// Sistema de notificações
function mostrarNotificacao(mensagem, tipo = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${tipo}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${tipo === 'success' ? '✓' : '⚠'}</span>
      <span class="notification-text">${mensagem}</span>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Verificar login ao carregar a página
function verificarLogin() {
  const usuario = localStorage.getItem('usuarioAtual');
  if (usuario) {
    usuarioAtual = usuario;
    planoAtual = localStorage.getItem(`plano_${usuario}`) || 'free';

    atualizarInfoUsuario();
    
    // Esconder todas as seções primeiro
    document.querySelectorAll('.main').forEach(el => {
      el.classList.add('hidden');
      el.style.display = 'none';
    });
    
    // Mostrar página inicial
    const homeSection = document.getElementById('home');
    homeSection.classList.remove('hidden');
    homeSection.style.display = 'block';

    atualizarInterfacePremium();
    atualizarHistorico(); // Carregar histórico ao iniciar
    atualizarDashboard(); // Atualizar dashboard inicial
  } else {
    // Mostrar apenas login se não estiver logado
    document.querySelectorAll('.main').forEach(el => {
      el.classList.add('hidden');
      el.style.display = 'none';
    });
    
    const loginSection = document.getElementById('login');
    loginSection.classList.remove('hidden');
    loginSection.style.display = 'block';
  }
}

// Função para tratar erros do Chart.js
function atualizarGraficoSeguro(registros) {
  try {
    const canvas = document.getElementById('graficoIntensidade');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Destruir gráfico anterior se existir
    if (window.chartInstance) {
      window.chartInstance.destroy();
    }

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (registros.length === 0) {
      ctx.font = '16px Arial';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText('Nenhum dado para exibir', canvas.width / 2, canvas.height / 2);
      return;
    }

    // Preparar dados (últimos 30 registros para melhor visualização)
    const dadosGrafico = registros.slice(0, 30).reverse();
    const datas = dadosGrafico.map(reg => new Date(reg.data).toLocaleDateString('pt-BR'));
    const intensidades = dadosGrafico.map(reg => reg.intensidade);

    window.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: datas,
        datasets: [{
          label: 'Intensidade da Dor',
          data: intensidades,
          borderColor: '#f06292',
          backgroundColor: 'rgba(240, 98, 146, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          borderWidth: 3,
          pointBackgroundColor: '#f06292',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Evolução da Intensidade da Dor',
            font: {
              size: 18,
              weight: 'bold'
            },
            color: '#2d3748'
          },
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#2d3748',
            bodyColor: '#4a5568',
            borderColor: '#f06292',
            borderWidth: 2,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: function(context) {
                return `Data: ${context[0].label}`;
              },
              label: function(context) {
                const registro = dadosGrafico[context.dataIndex];
                return [
                  `Intensidade: ${context.parsed.y}/10`,
                  `Local: ${registro.local}`,
                  `Descrição: ${registro.descricao.length > 50 ? registro.descricao.substring(0, 50) + '...' : registro.descricao}`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            title: {
              display: true,
              text: 'Intensidade (1-10)',
              font: {
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              stepSize: 1
            }
          },
          x: {
            title: {
              display: true,
              text: 'Data do Registro',
              font: {
                weight: 'bold'  
              }
            },
            grid: {
              display: false
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  } catch (error) {
    console.error('Erro ao criar gráfico:', error);
    const canvas = document.getElementById('graficoIntensidade');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.font = '14px Arial';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('Erro ao carregar gráfico', canvas.width / 2, canvas.height / 2);
    }
  }
}

// Adicionar estado de carregamento
function adicionarEstadoCarregamento(elemento, tempo = 1000) {
  elemento.classList.add('loading');
  elemento.style.pointerEvents = 'none';

  setTimeout(() => {
    elemento.classList.remove('loading');
    elemento.style.pointerEvents = 'auto';
  }, tempo);
}

// Melhorar navegação
function navegarComTransicao(secaoId) {
  // Adicionar feedback visual
  const botao = event?.target;
  if (botao) {
    adicionarEstadoCarregamento(botao, 500);
  }

  // Scroll suave para o topo
  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    showSection(secaoId);
  }, 200);
}

// Validação melhorada de formulários
function validarFormularioRegistro() {
  const local = document.getElementById('local').value.trim();
  const intensidade = document.getElementById('intensidade').value;
  const descricao = document.getElementById('descricao').value.trim();

  const erros = [];

  if (!local) erros.push('Local da dor é obrigatório');
  if (!intensidade) erros.push('Intensidade é obrigatória');
  if (!descricao) erros.push('Descrição é obrigatória');
  if (descricao && descricao.length < 10) erros.push('Descrição deve ter pelo menos 10 caracteres');

  if (erros.length > 0) {
    mostrarNotificacao(erros.join(', '), 'error');
    return false;
  }

  return true;
}

// Melhorar função de registro
function registrarDor() {
  if (!usuarioAtual) {
    mostrarNotificacao('Por favor, faça login primeiro', 'error');
    return;
  }

  if (!validarFormularioRegistro()) {
    return;
  }

  const local = document.getElementById('local').value.trim();
  const intensidade = document.getElementById('intensidade').value;
  const descricao = document.getElementById('descricao').value.trim();

  const registro = {
    id: Date.now(),
    data: new Date().toISOString(),
    local,
    intensidade: Number(intensidade),
    descricao
  };

  let registros = JSON.parse(localStorage.getItem(`registrosDor_${usuarioAtual}`) || '[]');
  registros.push(registro);
  localStorage.setItem(`registrosDor_${usuarioAtual}`, JSON.stringify(registros));

  // Limpar campos com animação
  const campos = ['local', 'descricao'];
  campos.forEach(id => {
    const campo = document.getElementById(id);
    campo.style.transform = 'scale(0.98)';
    setTimeout(() => {
      campo.value = '';
      campo.style.transform = 'scale(1)';
    }, 100);
  });

  // Reset slider
  document.getElementById('intensidadeRange').value = '5';
  document.getElementById('intensidade').value = '5';
  document.getElementById('intensidadeValue').textContent = '5';
  document.getElementById('intensidadeDesc').textContent = 'Moderada';

  mostrarNotificacao('✅ Dor registrada com sucesso!', 'success');
  atualizarHistorico();

  // Sugerir próxima ação
  setTimeout(() => {
    if (confirm('Registro salvo! Deseja ver seu histórico atualizado?')) {
      showSection('historico');
    }
  }, 2000);
}

// Funções para áreas premium
function carregarConsultas() {
  const content = document.getElementById('consultasContent');
  if (planoAtual === 'gratuito') {
    content.innerHTML = `
      <div class="premium-placeholder">
        <h3>Recursos Premium</h3>
        <p>Faça upgrade para acessar consultas com especialistas.</p>
        <button class="primary-btn" onclick="showSection('planos')">Ver Planos</button>
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <div class="consultas-dashboard">
      <div class="consulta-card">
        <h4>🩺 Próximas Consultas</h4>
        <div class="consulta-item">
          <strong>Dra. Maria Silva - Ginecologista</strong>
          <p>Amanhã, 14:00 - Consulta de acompanhamento</p>
          <button class="feature-btn">Entrar na consulta</button>
        </div>
      </div>
      <div class="consulta-card">
        <h4>📋 Histórico Médico</h4>
        <p>Acesse seu histórico completo de consultas e prescrições</p>
        <button class="feature-btn" onclick="verHistoricoMedico()">Ver Histórico</button>
      </div>
    </div>
  `;
}

function carregarRelatorios() {
  const content = document.getElementById('relatoriosContent');
  if (planoAtual === 'gratuito') {
    content.innerHTML = `
      <div class="premium-placeholder">
        <h3>Recursos Premium</h3>
        <p>Faça upgrade para gerar relatórios personalizados.</p>
        <button class="primary-btn" onclick="showSection('planos')">Ver Planos</button>
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <div class="relatorios-dashboard">
      <div class="relatorio-card">
        <h4>📊 Relatório Mensal</h4>
        <p>Análise detalhada dos seus sintomas dos últimos 30 dias</p>
        <button class="feature-btn" onclick="gerarRelatorioMensal()">Gerar Relatório</button>
      </div>
      <div class="relatorio-card">
        <h4>📈 Tendências</h4>
        <p>Identificação de padrões e correlações em seus dados</p>
        <button class="feature-btn" onclick="verTendencias()">Ver Análise</button>
      </div>
    </div>
  `;
}

function carregarComunidade() {
  const content = document.getElementById('comunidadeContent');
  if (planoAtual === 'gratuito') {
    content.innerHTML = `
      <div class="premium-placeholder">
        <h3>Recursos Premium</h3>
        <p>Faça upgrade para acessar nossa comunidade exclusiva.</p>
        <button class="primary-btn" onclick="showSection('planos')">Ver Planos</button>
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <div class="comunidade-dashboard">
      <div class="comunidade-feed">
        <h4>💬 Discussões Recentes</h4>
        <div class="post-item">
          <strong>Ana P.</strong>
          <p>Alguém mais sente dores nas costas durante o ciclo?</p>
          <small>5 respostas • há 2 horas</small>
        </div>
        <div class="post-item">
          <strong>Dr. João Santos</strong>
          <p>Live sobre novos tratamentos hoje às 20h</p>
          <small>23 interessadas • há 4 horas</small>
        </div>
      </div>
      <button class="feature-btn" onclick="abrirComunidade()">Participar da Discussão</button>
    </div>
  `;
}

function carregarAreaPremium() {
  if (planoAtual !== 'premium' && planoAtual !== 'professional') {
    document.querySelector('#premium .plan-features-grid').style.filter = 'blur(3px)';
    document.querySelector('#premium .plan-features-grid').style.pointerEvents = 'none';
  }
}

function carregarAreaProfessional() {
  if (planoAtual !== 'professional') {
    document.querySelector('#professional .plan-features-grid').style.filter = 'blur(3px)';
    document.querySelector('#professional .plan-features-grid').style.pointerEvents = 'none';
  }
}

// Funções dos botões premium
function agendarConsulta() {
  if (planoAtual === 'gratuito') {
    mostrarNotificacao('Faça upgrade para acessar consultas online', 'error');
    showSection('planos');
    return;
  }
  mostrarNotificacao('Redirecionando para agendamento...', 'success');
}

function gerarRelatorio() {
  if (planoAtual === 'gratuito') {
    mostrarNotificacao('Relatórios avançados disponíveis no plano Premium', 'error');
    showSection('planos');
    return;
  }
  mostrarNotificacao('Gerando relatório personalizado...', 'success');
}

function acessarComunidade() {
  if (planoAtual === 'gratuito') {
    mostrarNotificacao('Comunidade exclusiva para membros Premium', 'error');
    showSection('planos');
    return;
  }
  mostrarNotificacao('Abrindo comunidade exclusiva...', 'success');
}

function montarEquipe() {
  if (planoAtual !== 'professional') {
    mostrarNotificacao('Equipe multidisciplinar disponível no plano Profissional', 'error');
    showSection('planos');
    return;
  }
  mostrarNotificacao('Conectando com especialistas...', 'success');
}

function solicitarExame() {
  if (planoAtual !== 'professional') {
    mostrarNotificacao('Análises avançadas disponíveis no plano Profissional', 'error');
    showSection('planos');
    return;
  }
  mostrarNotificacao('Solicitando análises especializadas...', 'success');
}

function conectarInternacional() {
  if (planoAtual !== 'professional') {
    mostrarNotificacao('Rede internacional disponível no plano Profissional', 'error');
    showSection('planos');
    return;
  }
  mostrarNotificacao('Conectando com rede global de especialistas...', 'success');
}

function assinarPlano(plano) {
  planoAtual = plano;
  localStorage.setItem(`plano_${usuarioAtual}`, plano);
  atualizarInfoUsuario();
  mostrarNotificacao(`Parabéns! Você agora é ${plano === 'premium' ? 'Premium' : 'Profissional'}!`, 'success');

  atualizarInterfacePremium();
}

function carregarDados() {
  exibirHistorico();
  if (document.getElementById('historico').style.display !== 'none') {
    criarGrafico();
  }
}

// Permitir envio com Enter no chat
document.addEventListener('DOMContentLoaded', function() {
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        enviarMensagem();
      }
    });
  }
});

// Função para atualizar dashboard da página inicial
function atualizarDashboard() {
  if (!usuarioAtual) return;

  const registros = JSON.parse(localStorage.getItem(`registrosDor_${usuarioAtual}`) || '[]');
  const statusRegistros = document.getElementById('statusRegistros');
  const statusAnalise = document.getElementById('statusAnalise');

  if (statusRegistros) {
    if (registros.length === 0) {
      statusRegistros.textContent = 'Nenhum registro ainda';
    } else {
      const ultimoRegistro = new Date(registros[registros.length - 1].data);
      const diasAtras = Math.floor((Date.now() - ultimoRegistro.getTime()) / (1000 * 60 * 60 * 24));
      statusRegistros.textContent = `${registros.length} registros • Último há ${diasAtras} dia${diasAtras !== 1 ? 's' : ''}`;
    }
  }

  if (statusAnalise) {
    if (registros.length < 3) {
      statusAnalise.textContent = 'Precisa de mais registros para análise';
    } else {
      const intensidadeMedia = registros.reduce((acc, reg) => acc + reg.intensidade, 0) / registros.length;
      statusAnalise.textContent = `Intensidade média: ${intensidadeMedia.toFixed(1)}/10`;
    }
  }
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  verificarLogin();

  // Slider de intensidade
  const intensidadeRange = document.getElementById('intensidadeRange');
  if (intensidadeRange) {
    updateIntensidade();
  }

  // Fechar sidebar ao clicar fora
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.toggle-btn');

    if (sidebar && sidebar.classList.contains('open') && 
        !sidebar.contains(e.target) && 
        !toggleBtn.contains(e.target)) {
      sidebar.classList.remove('open');
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) overlay.remove();
    }
  });

  // Lazy loading para seções pesadas
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        if (section.id === 'historico' && !section.dataset.loaded) {
          atualizarHistorico();
          section.dataset.loaded = 'true';
        }
      }
    });
  }, { threshold: 0.1 });

  const historicoSection = document.getElementById('historico');
  if (historicoSection) {
    observer.observe(historicoSection);
  }
});