import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Limpando banco de dados...')

  await prisma.questionOption.deleteMany()
  await prisma.question.deleteMany()
  await prisma.lessonStep.deleteMany()
  await prisma.userProgress.deleteMany()
  await prisma.userStreak.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.learningPath.deleteMany()

  console.log('Populando banco de dados...')

  // ══════════════════════════════════════════════════════════════════════
  // TRILHA 1 — ORÇAMENTO INTELIGENTE
  // ══════════════════════════════════════════════════════════════════════
  const orcamento = await prisma.learningPath.create({
    data: {
      slug: 'orcamento-inteligente',
      title: 'Orçamento Inteligente',
      description: 'Aprenda a organizar suas finanças, controlar gastos e construir uma reserva de emergência com estratégias simples e eficazes.',
      iconName: 'wallet',
      colorToken: 'teal',
      orderIndex: 0,
      isPublished: true,
    },
  })

  // ── Lição 1 — O que é um Orçamento? ──────────────────────────────────
  const orc1 = await prisma.lesson.create({
    data: {
      id: 'licao-orc-1',
      pathId: orcamento.id,
      title: 'O que é um Orçamento?',
      description: 'Entenda o conceito de orçamento pessoal e por que ele é a base de uma vida financeira saudável.',
      orderIndex: 0,
      estimatedMins: 3,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-o1-1',
      lessonId: orc1.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'O que é um orçamento pessoal?',
        body: 'Um orçamento é um plano de como você vai gastar e poupar seu dinheiro ao longo de um período — normalmente um mês. Ele dá uma função a cada real antes de você gastá-lo.\n\nSem um orçamento, é fácil gastar demais em algumas áreas e poupar de menos em outras sem perceber. O orçamento torna sua situação financeira visível e previsível.\n\nNo Brasil, uma pesquisa da Serasa mostrou que mais de 70 milhões de pessoas estão endividadas. A maioria nunca aprendeu a criar um orçamento simples.',
        tip: 'Um orçamento não é uma restrição — é uma permissão para gastar sem culpa dentro do seu plano.',
      },
    },
  })

  const stepO1Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-o1-2',
      lessonId: orc1.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qO1 = await prisma.question.create({
    data: {
      id: 'q-o1-1',
      stepId: stepO1Quiz.id,
      questionText: 'Qual é o principal objetivo de um orçamento pessoal?',
      explanation: 'Um orçamento é um plano antecipado que atribui uma finalidade a cada real antes de você gastá-lo, tornando sua vida financeira clara e intencional.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-o1-1-a', questionId: qO1.id, text: 'Registrar gastos depois de já tê-los feito', isCorrect: false, orderIndex: 0 },
      { id: 'opt-o1-1-b', questionId: qO1.id, text: 'Planejar como distribuir o dinheiro antes de gastar', isCorrect: true, orderIndex: 1 },
      { id: 'opt-o1-1-c', questionId: qO1.id, text: 'Eliminar todos os gastos com lazer', isCorrect: false, orderIndex: 2 },
      { id: 'opt-o1-1-d', questionId: qO1.id, text: 'Solicitar um empréstimo bancário', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-o1-3',
      lessonId: orc1.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Pense no último mês. Houve alguma compra que você se arrependeu ou que não estava no seu plano?',
        hint: 'Não há resposta certa ou errada. O objetivo é desenvolver consciência financeira.',
      },
    },
  })

  // ── Lição 2 — A Regra 50/30/20 ────────────────────────────────────────
  const orc2 = await prisma.lesson.create({
    data: {
      id: 'licao-orc-2',
      pathId: orcamento.id,
      title: 'A Regra 50/30/20',
      description: 'Um método simples para dividir sua renda entre necessidades, desejos e poupança.',
      orderIndex: 1,
      estimatedMins: 4,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-o2-1',
      lessonId: orc2.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'A Regra 50/30/20',
        body: 'Um dos métodos de orçamento mais populares divide sua renda líquida em três grupos:\n\n**50% — Necessidades**: Aluguel, mercado, contas de água, luz e internet, parcelas mínimas de dívidas.\n\n**30% — Desejos**: Restaurantes, streaming, hobbies, roupas novas. O que melhora a qualidade de vida mas não é essencial.\n\n**20% — Poupança e Investimentos**: Reserva de emergência, Tesouro Direto, previdência. Sua segurança financeira futura.',
        tip: 'Esses percentuais são um ponto de partida. Ajuste conforme sua renda e o custo de vida na sua cidade.',
      },
    },
  })

  const stepO2Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-o2-2',
      lessonId: orc2.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qO2 = await prisma.question.create({
    data: {
      id: 'q-o2-1',
      stepId: stepO2Quiz.id,
      questionText: 'Na regra 50/30/20, em qual categoria se encaixa uma assinatura de streaming (Netflix, Spotify)?',
      explanation: 'Serviços de streaming são gastos discricionários — melhoram a qualidade de vida, mas não são essenciais para a sobrevivência. Por isso, se enquadram nos Desejos (30%).',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-o2-1-a', questionId: qO2.id, text: 'Necessidades (50%)', isCorrect: false, orderIndex: 0 },
      { id: 'opt-o2-1-b', questionId: qO2.id, text: 'Desejos (30%)', isCorrect: true, orderIndex: 1 },
      { id: 'opt-o2-1-c', questionId: qO2.id, text: 'Poupança (20%)', isCorrect: false, orderIndex: 2 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-o2-3',
      lessonId: orc2.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Olhando para seus gastos atuais, qual categoria você acha que consome mais da sua renda — Necessidades, Desejos ou Poupança?',
        hint: 'Seja honesto consigo mesmo. A maioria das pessoas se surpreende quando realmente analisa os números.',
      },
    },
  })

  // ── Lição 3 — Reserva de Emergência ──────────────────────────────────
  const orc3 = await prisma.lesson.create({
    data: {
      id: 'licao-orc-3',
      pathId: orcamento.id,
      title: 'Reserva de Emergência',
      description: 'Entenda por que ter 3 a 6 meses de despesas guardados muda completamente sua relação com o dinheiro.',
      orderIndex: 2,
      estimatedMins: 4,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-o3-1',
      lessonId: orc3.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'Por que a reserva de emergência é indispensável?',
        body: 'Imagine que seu carro quebra, você perde o emprego ou tem um problema de saúde inesperado. Sem uma reserva, a única opção é o cheque especial (com juros de até 8% ao mês) ou o cartão de crédito rotativo.\n\nA reserva de emergência é um colchão financeiro de 3 a 6 meses das suas despesas mensais, guardado em um lugar seguro e líquido — como o Tesouro Selic ou um CDB com liquidez diária.\n\nEla não é para investir. É para dormir tranquilo.',
        tip: 'Guarde sua reserva em uma conta separada da sua conta corrente para evitar a tentação de usá-la.',
      },
    },
  })

  const stepO3Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-o3-2',
      lessonId: orc3.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qO3 = await prisma.question.create({
    data: {
      id: 'q-o3-1',
      stepId: stepO3Quiz.id,
      questionText: 'Qual é o melhor lugar para guardar sua reserva de emergência?',
      explanation: 'A reserva precisa ser segura e ter liquidez imediata. O Tesouro Selic e CDBs com liquidez diária são ideais: rendem mais que a poupança e você pode resgatar quando precisar.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-o3-1-a', questionId: qO3.id, text: 'Em ações da bolsa para crescer mais rápido', isCorrect: false, orderIndex: 0 },
      { id: 'opt-o3-1-b', questionId: qO3.id, text: 'Em Tesouro Selic ou CDB com liquidez diária', isCorrect: true, orderIndex: 1 },
      { id: 'opt-o3-1-c', questionId: qO3.id, text: 'Em dinheiro vivo em casa', isCorrect: false, orderIndex: 2 },
      { id: 'opt-o3-1-d', questionId: qO3.id, text: 'Em criptomoedas por segurança', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-o3-3',
      lessonId: orc3.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Se você perdesse sua fonte de renda hoje, por quantos meses conseguiria se manter com o dinheiro que tem disponível?',
        hint: 'Não há julgamento aqui. Esse exercício é o primeiro passo para construir sua segurança financeira.',
      },
    },
  })

  // ── Lição 4 — Como Controlar Gastos no Dia a Dia ─────────────────────
  const orc4 = await prisma.lesson.create({
    data: {
      id: 'licao-orc-4',
      pathId: orcamento.id,
      title: 'Como Controlar Gastos no Dia a Dia',
      description: 'Métodos práticos para registrar e categorizar cada real gasto, do papel ao app.',
      orderIndex: 3,
      estimatedMins: 3,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-o4-1',
      lessonId: orc4.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'Como registrar seus gastos na prática',
        body: 'O controle de gastos só funciona se for simples o suficiente para manter no longo prazo. Existem três abordagens principais:\n\n**Planilha**: Gratuita, flexível, ideal para quem gosta de personalizar. O Google Sheets funciona perfeitamente no celular.\n\n**Aplicativo**: GuiaBolso, Mobills e Organizze conectam ao seu banco automaticamente e categorizam gastos. Reduz atrito.\n\n**Método dos envelopes**: Dinheiro em papel dividido em categorias físicas. Radical, mas muito eficaz para quem gasta demais no cartão.\n\nO segredo não é qual método você usa — é que você realmente o use toda semana.',
        tip: 'Reserve 10 minutos toda semana (por exemplo, domingo à noite) para revisar seus gastos da semana. Esse hábito simples muda tudo.',
      },
    },
  })

  const stepO4Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-o4-2',
      lessonId: orc4.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qO4 = await prisma.question.create({
    data: {
      id: 'q-o4-1',
      stepId: stepO4Quiz.id,
      questionText: 'Qual é o fator mais importante para que um método de controle de gastos funcione?',
      explanation: 'O melhor método de controle de gastos é aquele que você consegue manter consistentemente. De nada adianta a ferramenta mais sofisticada se você não a usa com regularidade.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-o4-1-a', questionId: qO4.id, text: 'Usar o aplicativo mais completo disponível', isCorrect: false, orderIndex: 0 },
      { id: 'opt-o4-1-b', questionId: qO4.id, text: 'Categorizar cada gasto com precisão máxima', isCorrect: false, orderIndex: 1 },
      { id: 'opt-o4-1-c', questionId: qO4.id, text: 'Manter o hábito de registrar com consistência', isCorrect: true, orderIndex: 2 },
      { id: 'opt-o4-1-d', questionId: qO4.id, text: 'Registrar apenas os gastos grandes (acima de R$50)', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-o4-3',
      lessonId: orc4.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Você já tentou controlar seus gastos antes? O que funcionou e o que não funcionou nessa tentativa?',
        hint: 'Entender por que métodos anteriores falharam ajuda a escolher uma abordagem mais adequada ao seu estilo de vida.',
      },
    },
  })

  // ── Lição 5 — Cortar Gastos Sem Sofrimento ───────────────────────────
  const orc5 = await prisma.lesson.create({
    data: {
      id: 'licao-orc-5',
      pathId: orcamento.id,
      title: 'Cortar Gastos Sem Sofrimento',
      description: 'Estratégias inteligentes para reduzir despesas sem abrir mão do que importa para você.',
      orderIndex: 4,
      estimatedMins: 3,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-o5-1',
      lessonId: orc5.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'Como reduzir gastos de forma inteligente',
        body: 'Cortar gastos não significa privação — significa direcionar seu dinheiro para o que realmente importa.\n\n**Gastos invisíveis**: Assinaturas que você esqueceu (apps, planos, serviços). Revise seu extrato do último mês — você pode se surpreender.\n\n**Renegociar fixos**: Internet, plano de celular, seguro. Uma ligação de 15 minutos pode economizar R$50 a R$200 por mês.\n\n**A regra dos 30 dias**: Antes de comprar algo não essencial, espere 30 dias. Se ainda quiser depois, compre. A maioria das vontades passa.\n\n**Distinguir desejo de necessidade**: Pergunte-se: "Minha vida piora significativamente sem isso?" Se não, é um desejo.',
        tip: 'Comece pelos gastos que você mal nota mas paga todo mês. São os mais fáceis de cortar porque você não vai sentir falta.',
      },
    },
  })

  const stepO5Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-o5-2',
      lessonId: orc5.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qO5 = await prisma.question.create({
    data: {
      id: 'q-o5-1',
      stepId: stepO5Quiz.id,
      questionText: 'Qual estratégia costuma gerar economia imediata sem impacto perceptível no dia a dia?',
      explanation: 'Assinaturas esquecidas (streaming, apps, serviços) são cobradas automaticamente todo mês sem que você perceba o valor gerado. Cancelá-las ou renegociá-las é o corte com menor "dor" e efeito imediato.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-o5-1-a', questionId: qO5.id, text: 'Parar de comer fora completamente', isCorrect: false, orderIndex: 0 },
      { id: 'opt-o5-1-b', questionId: qO5.id, text: 'Cancelar assinaturas e serviços que você não usa mais', isCorrect: true, orderIndex: 1 },
      { id: 'opt-o5-1-c', questionId: qO5.id, text: 'Não comprar nada por 30 dias', isCorrect: false, orderIndex: 2 },
      { id: 'opt-o5-1-d', questionId: qO5.id, text: 'Trocar de banco para um sem tarifas', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-o5-3',
      lessonId: orc5.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Há algum gasto na sua vida que você sabe que poderia cortar, mas ainda não cortou? O que te impede?',
        hint: 'Às vezes a resistência é emocional, não financeira. Identificar isso é o primeiro passo para mudar.',
      },
    },
  })

  // ══════════════════════════════════════════════════════════════════════
  // TRILHA 2 — INVESTIMENTOS PARA INICIANTES
  // ══════════════════════════════════════════════════════════════════════
  const investimentos = await prisma.learningPath.create({
    data: {
      slug: 'investimentos-iniciantes',
      title: 'Investimentos para Iniciantes',
      description: 'Desmistifique os investimentos. Aprenda como fazer seu dinheiro trabalhar por você com segurança e consistência.',
      iconName: 'trending-up',
      colorToken: 'indigo',
      orderIndex: 1,
      isPublished: true,
    },
  })

  // ── Lição 1 — Por que Investir? ────────────────────────────────────────
  const inv1 = await prisma.lesson.create({
    data: {
      id: 'licao-inv-1',
      pathId: investimentos.id,
      title: 'Por que Investir?',
      description: 'Entenda o poder dos juros compostos e por que o tempo é seu maior aliado nos investimentos.',
      orderIndex: 0,
      estimatedMins: 4,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-i1-1',
      lessonId: inv1.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'Por que investir é mais inteligente do que só poupar?',
        body: 'Guardar dinheiro na poupança parece seguro, mas a inflação corrói silenciosamente seu poder de compra. Em 2024, a poupança rendeu cerca de 6,17% ao ano — enquanto o IPCA ficou em torno de 4,8%. O ganho real foi de menos de 2%.\n\nInvestir faz seu dinheiro trabalhar por você. O Ibovespa acumula retorno médio histórico de cerca de 13% ao ano. R$1.000 investidos hoje podem se transformar em aproximadamente R$11.500 em 20 anos — sem adicionar um centavo sequer.\n\nO segredo são os juros compostos: você ganha juros sobre juros, e o efeito cresce exponencialmente com o tempo.',
        tip: 'Os juros compostos não são lineares — os maiores ganhos acontecem nos anos finais. Comece cedo, mesmo com pequenos valores.',
      },
    },
  })

  const stepI1Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-i1-2',
      lessonId: inv1.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qI1 = await prisma.question.create({
    data: {
      id: 'q-i1-1',
      stepId: stepI1Quiz.id,
      questionText: 'Por que deixar dinheiro somente na poupança pode ser um risco a longo prazo?',
      explanation: 'A inflação reduz o poder de compra. Se o rendimento da poupança for menor que a inflação, seu dinheiro compra menos ao longo do tempo, mesmo que o saldo na conta aumente.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-i1-1-a', questionId: qI1.id, text: 'Os bancos podem falir a qualquer momento', isCorrect: false, orderIndex: 0 },
      { id: 'opt-i1-1-b', questionId: qI1.id, text: 'A inflação pode corroer o poder de compra mais rápido do que os juros crescem', isCorrect: true, orderIndex: 1 },
      { id: 'opt-i1-1-c', questionId: qI1.id, text: 'A poupança cobra taxas mensais abusivas', isCorrect: false, orderIndex: 2 },
      { id: 'opt-i1-1-d', questionId: qI1.id, text: 'Você não consegue sacar o dinheiro quando precisa', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-i1-3',
      lessonId: inv1.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Se você tivesse R$500 que não precisaria usar por 5 anos, o que faria com esse dinheiro hoje?',
        hint: 'Reflita sobre o que aprendeu. Não há resposta errada — isso é sobre entender sua mentalidade atual.',
      },
    },
  })

  // ── Lição 2 — Renda Fixa vs Renda Variável ────────────────────────────
  const inv2 = await prisma.lesson.create({
    data: {
      id: 'licao-inv-2',
      pathId: investimentos.id,
      title: 'Renda Fixa vs Renda Variável',
      description: 'Os dois pilares do mercado financeiro explicados de forma simples e prática.',
      orderIndex: 1,
      estimatedMins: 4,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-i2-1',
      lessonId: inv2.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'Renda Fixa e Renda Variável: qual a diferença?',
        body: '**Renda Fixa** é quando você empresta dinheiro para o governo ou um banco e recebe uma remuneração combinada. Exemplos: Tesouro Direto, CDB, LCI, LCA. O risco é menor, o retorno é previsível.\n\n**Renda Variável** é quando você se torna sócio de uma empresa ou investe em ativos cujo preço oscila no mercado. Exemplos: ações, fundos imobiliários (FIIs), ETFs. O risco é maior, mas o potencial de retorno também.\n\nA maioria dos especialistas recomenda uma carteira diversificada com os dois tipos, ajustando a proporção conforme seu perfil e objetivos.',
        tip: 'Comece pela renda fixa para construir sua reserva de emergência. Depois, explore a renda variável com o dinheiro que você não precisará no curto prazo.',
      },
    },
  })

  const stepI2Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-i2-2',
      lessonId: inv2.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qI2 = await prisma.question.create({
    data: {
      id: 'q-i2-1',
      stepId: stepI2Quiz.id,
      questionText: 'Qual das opções abaixo é um exemplo de investimento em Renda Fixa?',
      explanation: 'O Tesouro Direto é um título do governo federal com remuneração definida no momento da compra — características típicas da renda fixa. Ações e FIIs são renda variável.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-i2-1-a', questionId: qI2.id, text: 'Ações da Petrobras (PETR4)', isCorrect: false, orderIndex: 0 },
      { id: 'opt-i2-1-b', questionId: qI2.id, text: 'Tesouro Selic', isCorrect: true, orderIndex: 1 },
      { id: 'opt-i2-1-c', questionId: qI2.id, text: 'Fundo Imobiliário (FII)', isCorrect: false, orderIndex: 2 },
      { id: 'opt-i2-1-d', questionId: qI2.id, text: 'Bitcoin', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-i2-3',
      lessonId: inv2.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Pensando no seu perfil, você se considera mais conservador (prefere segurança) ou mais arrojado (aceita riscos em troca de maior retorno)?',
        hint: 'Não há perfil certo ou errado. O importante é conhecer a si mesmo para tomar decisões alinhadas aos seus objetivos.',
      },
    },
  })

  // ── Lição 3 — Tesouro Direto na Prática ──────────────────────────────
  const inv3 = await prisma.lesson.create({
    data: {
      id: 'licao-inv-3',
      pathId: investimentos.id,
      title: 'Tesouro Direto na Prática',
      description: 'Como comprar títulos públicos e entender as diferenças entre Selic, IPCA+ e Prefixado.',
      orderIndex: 2,
      estimatedMins: 5,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-i3-1',
      lessonId: inv3.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'Os três títulos do Tesouro Direto',
        body: 'O Tesouro Direto permite comprar títulos do governo federal a partir de R$30. Existem três tipos principais:\n\n**Tesouro Selic**: Acompanha a taxa básica de juros (Selic). Liquidez diária, sem risco de perda. Ideal para reserva de emergência e curto prazo.\n\n**Tesouro IPCA+**: Rende a inflação (IPCA) + uma taxa fixa. Protege o poder de compra. Indicado para objetivos de médio e longo prazo como aposentadoria.\n\n**Tesouro Prefixado**: Taxa de rendimento já definida no momento da compra. Se carregado até o vencimento, você sabe exatamente o que vai receber. Bom para quem acredita que os juros vão cair.',
        tip: 'Para a reserva de emergência, use sempre o Tesouro Selic. Para objetivos de longo prazo (mais de 5 anos), o IPCA+ protege melhor seu patrimônio.',
      },
    },
  })

  const stepI3Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-i3-2',
      lessonId: inv3.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qI3 = await prisma.question.create({
    data: {
      id: 'q-i3-1',
      stepId: stepI3Quiz.id,
      questionText: 'Para proteger o poder de compra contra a inflação a longo prazo, qual título é mais indicado?',
      explanation: 'O Tesouro IPCA+ é indexado à inflação (IPCA) mais uma taxa real. Isso garante que o investimento sempre cresça acima da inflação, preservando seu poder de compra.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-i3-1-a', questionId: qI3.id, text: 'Tesouro Selic, por ter liquidez diária', isCorrect: false, orderIndex: 0 },
      { id: 'opt-i3-1-b', questionId: qI3.id, text: 'Tesouro IPCA+, por ser indexado à inflação', isCorrect: true, orderIndex: 1 },
      { id: 'opt-i3-1-c', questionId: qI3.id, text: 'Tesouro Prefixado, por ter taxa garantida', isCorrect: false, orderIndex: 2 },
      { id: 'opt-i3-1-d', questionId: qI3.id, text: 'Poupança, por ser mais segura', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-i3-3',
      lessonId: inv3.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Para qual objetivo você usaria o Tesouro Direto — aposentadoria, viagem, casa própria ou outro? Qual título seria mais adequado para esse objetivo?',
        hint: 'Pense no prazo do seu objetivo. Curto prazo (até 2 anos) = Selic. Longo prazo = IPCA+.',
      },
    },
  })

  // ── Lição 4 — Fundos Imobiliários (FIIs) ─────────────────────────────
  const inv4 = await prisma.lesson.create({
    data: {
      id: 'licao-inv-4',
      pathId: investimentos.id,
      title: 'Fundos Imobiliários (FIIs)',
      description: 'Invista no mercado imobiliário a partir de R$100 e receba rendimentos mensais.',
      orderIndex: 3,
      estimatedMins: 4,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-i4-1',
      lessonId: inv4.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'O que são Fundos Imobiliários?',
        body: 'FIIs são fundos que investem em imóveis (shoppings, galpões logísticos, escritórios, hospitais) ou em papéis do setor imobiliário (CRIs, LCIs).\n\nAo comprar cotas, você se torna proprietário de uma fatia desses ativos e recebe uma parte dos aluguéis mensalmente — diretamente na sua conta, isento de Imposto de Renda para pessoa física.\n\n**Tipos principais:**\n- **FIIs de Tijolo**: Possuem imóveis físicos. Renda vem dos aluguéis.\n- **FIIs de Papel**: Investem em títulos do setor. Mais liquidez, menos volatilidade.\n\nÉ possível começar com menos de R$100 pela bolsa de valores.',
        tip: 'Observe o Dividend Yield (DY) anual — o percentual de rendimento pago em relação ao preço da cota. FIIs saudáveis costumam pagar entre 6% e 12% ao ano.',
      },
    },
  })

  const stepI4Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-i4-2',
      lessonId: inv4.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qI4 = await prisma.question.create({
    data: {
      id: 'q-i4-1',
      stepId: stepI4Quiz.id,
      questionText: 'Qual é a principal vantagem dos FIIs para o pequeno investidor pessoa física?',
      explanation: 'Os FIIs pagam rendimentos mensais (aluguéis) isentos de IR para pessoa física e permitem investir no mercado imobiliário com muito pouco capital, democratizando um mercado antes restrito.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-i4-1-a', questionId: qI4.id, text: 'Garantia de retorno fixo e previsível', isCorrect: false, orderIndex: 0 },
      { id: 'opt-i4-1-b', questionId: qI4.id, text: 'Rendimentos mensais isentos de IR com pouco capital inicial', isCorrect: true, orderIndex: 1 },
      { id: 'opt-i4-1-c', questionId: qI4.id, text: 'Proteção total contra variações do mercado', isCorrect: false, orderIndex: 2 },
      { id: 'opt-i4-1-d', questionId: qI4.id, text: 'Possibilidade de morar no imóvel do fundo', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-i4-3',
      lessonId: inv4.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Você já pensou em imóveis como forma de investimento? Saber que pode começar com menos de R$100 muda sua perspectiva?',
        hint: 'Pense nas vantagens e desvantagens em relação a comprar um imóvel físico: liquidez, capital inicial, diversificação.',
      },
    },
  })

  // ── Lição 5 — Começando com R$50 por Mês ─────────────────────────────
  const inv5 = await prisma.lesson.create({
    data: {
      id: 'licao-inv-5',
      pathId: investimentos.id,
      title: 'Começando com R$50 por Mês',
      description: 'Como iniciar sua jornada de investimentos com pequenos valores e construir o hábito que vai mudar sua vida.',
      orderIndex: 4,
      estimatedMins: 3,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-i5-1',
      lessonId: inv5.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'O poder dos aportes regulares',
        body: 'Muitas pessoas esperam ter "dinheiro suficiente" para investir. Mas o maior inimigo dos investimentos não é falta de capital — é a falta de consistência.\n\nAportes mensais regulares (mesmo que pequenos) criam dois benefícios poderosos:\n\n**Dollar-Cost Averaging (preço médio)**: Ao comprar todo mês, você compra mais quando os preços estão baixos e menos quando estão altos. No longo prazo, isso reduz o preço médio dos seus investimentos.\n\n**O hábito vale mais que o valor**: Quem investe R$50 por mês por 10 anos tem muito mais chance de sucesso do que quem planeja investir R$5.000 de uma vez "quando der".\n\nAutomatize seus aportes para o dia seguinte à chegada do seu salário.',
        tip: 'Configure uma transferência automática para sua conta de investimentos no dia do pagamento. Assim você investe antes de ter chance de gastar.',
      },
    },
  })

  const stepI5Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-i5-2',
      lessonId: inv5.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qI5 = await prisma.question.create({
    data: {
      id: 'q-i5-1',
      stepId: stepI5Quiz.id,
      questionText: 'Por que investir R$50 todo mês é melhor do que esperar juntar R$1.000 para investir de uma vez?',
      explanation: 'O tempo no mercado é mais valioso do que o valor aportado. Começar hoje com pouco e ser consistente gera mais resultado a longo prazo do que esperar o "momento certo" com um valor maior.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-i5-1-a', questionId: qI5.id, text: 'Porque R$1.000 é muito dinheiro para investir de uma vez', isCorrect: false, orderIndex: 0 },
      { id: 'opt-i5-1-b', questionId: qI5.id, text: 'Porque o tempo no mercado e a consistência superam o timing e o valor', isCorrect: true, orderIndex: 1 },
      { id: 'opt-i5-1-c', questionId: qI5.id, text: 'Porque os bancos cobram menos taxas em aportes menores', isCorrect: false, orderIndex: 2 },
      { id: 'opt-i5-1-d', questionId: qI5.id, text: 'Porque R$50 mensais é o mínimo aceito pelas corretoras', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-i5-3',
      lessonId: inv5.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Qual valor você poderia comprometer hoje para investir mensalmente de forma automática? Pense em um número que não vai fazer falta, mas que seja constante.',
        hint: 'Lembre-se: não existe valor pequeno demais para começar. O hábito é mais importante que o montante inicial.',
      },
    },
  })

  // ══════════════════════════════════════════════════════════════════════
  // TRILHA 3 — DÍVIDAS SOB CONTROLE
  // ══════════════════════════════════════════════════════════════════════
  const dividas = await prisma.learningPath.create({
    data: {
      slug: 'dividas-sob-controle',
      title: 'Dívidas Sob Controle',
      description: 'Entenda como as dívidas funcionam, aprenda estratégias para eliminá-las e recupere sua liberdade financeira.',
      iconName: 'credit-card',
      colorToken: 'amber',
      orderIndex: 2,
      isPublished: true,
    },
  })

  // ── Lição 1 — O Custo Real das Dívidas ───────────────────────────────
  const div1 = await prisma.lesson.create({
    data: {
      id: 'licao-div-1',
      pathId: dividas.id,
      title: 'O Custo Real das Dívidas',
      description: 'Descubra como os juros compostos trabalham contra você e o verdadeiro preço de cada dívida.',
      orderIndex: 0,
      estimatedMins: 4,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-d1-1',
      lessonId: div1.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'Os juros compostos como inimigo',
        body: 'Os juros compostos que enriquecem investidores são os mesmos que destroem quem está endividado — só que no sentido contrário.\n\nO cartão de crédito rotativo cobra, em média, 18% ao mês no Brasil. Uma dívida de R$1.000 que você ignora por apenas 12 meses se transforma em aproximadamente R$7.400.\n\nO cheque especial chega a 8% ao mês. Parece pouco, mas em 12 meses, R$1.000 viram R$2.500.\n\nO crédito pessoal em bancos tradicionais fica entre 3% e 5% ao mês. Ainda assim, R$1.000 em 2 anos valem R$3.200 de dívida.',
        tip: 'Antes de contrair qualquer dívida, calcule o custo total — não a parcela. "R$150 por mês" pode esconder um custo final duas vezes maior que o bem comprado.',
      },
    },
  })

  const stepD1Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-d1-2',
      lessonId: div1.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qD1 = await prisma.question.create({
    data: {
      id: 'q-d1-1',
      stepId: stepD1Quiz.id,
      questionText: 'Por que o cartão de crédito rotativo é considerado o pior tipo de dívida no Brasil?',
      explanation: 'Com taxas médias de 18% ao mês (mais de 500% ao ano), o rotativo do cartão de crédito é o produto financeiro de maior custo disponível no país. Uma dívida pequena pode se multiplicar em poucos meses.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-d1-1-a', questionId: qD1.id, text: 'Porque o banco pode cancelar o cartão sem aviso', isCorrect: false, orderIndex: 0 },
      { id: 'opt-d1-1-b', questionId: qD1.id, text: 'Porque cobra as maiores taxas de juros do mercado (até 18% ao mês)', isCorrect: true, orderIndex: 1 },
      { id: 'opt-d1-1-c', questionId: qD1.id, text: 'Porque não possui cobertura do FGC', isCorrect: false, orderIndex: 2 },
      { id: 'opt-d1-1-d', questionId: qD1.id, text: 'Porque os juros são cobrados sobre o limite total', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-d1-3',
      lessonId: div1.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Você sabe exatamente quais dívidas tem hoje, os valores e as taxas de juros de cada uma? Tente listar mentalmente.',
        hint: 'Muitas pessoas evitam olhar para as dívidas por ansiedade. Mas você não pode resolver o que não conhece.',
      },
    },
  })

  // ── Lição 2 — Bola de Neve vs Avalanche ──────────────────────────────
  const div2 = await prisma.lesson.create({
    data: {
      id: 'licao-div-2',
      pathId: dividas.id,
      title: 'Bola de Neve vs Avalanche',
      description: 'Dois métodos comprovados para eliminar dívidas — descubra qual se encaixa no seu perfil.',
      orderIndex: 1,
      estimatedMins: 4,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-d2-1',
      lessonId: div2.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'Dois caminhos para sair das dívidas',
        body: '**Método Bola de Neve** (Dave Ramsey): Pague o mínimo em todas as dívidas e direcione o máximo para a menor dívida primeiro. Quando ela acaba, use esse dinheiro para atacar a próxima.\n\n*Vantagem*: Vitórias rápidas mantêm a motivação alta.\n*Desvantagem*: Você paga mais juros no total.\n\n**Método Avalanche**: Pague o mínimo em todas e direcione o máximo para a dívida com maior taxa de juros primeiro.\n\n*Vantagem*: Matematicamente mais eficiente — você paga menos juros no total.\n*Desvantagem*: Pode demorar mais para ter a primeira vitória.\n\nAmbos funcionam. A escolha depende do seu perfil psicológico.',
        tip: 'Se você tem tendência a desistir, comece pela Bola de Neve — a motivação das vitórias rápidas vale mais do que a otimização matemática.',
      },
    },
  })

  const stepD2Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-d2-2',
      lessonId: div2.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qD2 = await prisma.question.create({
    data: {
      id: 'q-d2-1',
      stepId: stepD2Quiz.id,
      questionText: 'Qual método de quitação de dívidas minimiza o total pago em juros?',
      explanation: 'O Método Avalanche prioriza as dívidas com maior taxa de juros. Como você elimina primeiro as que crescem mais rápido, o custo total de juros ao longo do processo é menor.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-d2-1-a', questionId: qD2.id, text: 'Bola de Neve (menor dívida primeiro)', isCorrect: false, orderIndex: 0 },
      { id: 'opt-d2-1-b', questionId: qD2.id, text: 'Avalanche (maior taxa de juros primeiro)', isCorrect: true, orderIndex: 1 },
      { id: 'opt-d2-1-c', questionId: qD2.id, text: 'Os dois métodos têm o mesmo custo total', isCorrect: false, orderIndex: 2 },
      { id: 'opt-d2-1-d', questionId: qD2.id, text: 'Pagar todas as dívidas em parcelas iguais simultaneamente', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-d2-3',
      lessonId: div2.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Com base no que aprendeu, qual método parece mais adequado ao seu perfil — a motivação da Bola de Neve ou a eficiência da Avalanche? Por quê?',
        hint: 'Pense em como você reage quando os resultados demoram a aparecer. Isso diz muito sobre qual método vai funcionar para você.',
      },
    },
  })

  // ── Lição 3 — Como Negociar Dívidas ──────────────────────────────────
  const div3 = await prisma.lesson.create({
    data: {
      id: 'licao-div-3',
      pathId: dividas.id,
      title: 'Como Negociar Dívidas',
      description: 'Estratégias práticas para renegociar, obter descontos e sair do cadastro de inadimplentes.',
      orderIndex: 2,
      estimatedMins: 4,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-d3-1',
      lessonId: div3.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'Negociar dívidas é possível — e vale a pena',
        body: 'Credores preferem receber menos do que não receber nada. Isso te dá poder de negociação maior do que você imagina.\n\n**Feirão Limpa Nome (Serasa)**: Realizado periodicamente, oferece descontos de até 99% em dívidas antigas. Vale acompanhar.\n\n**Negociação direta**: Ligue para o credor com uma proposta concreta. Tenha em mãos o valor que consegue pagar à vista ou em quantas parcelas. Credores dão descontos maiores para pagamentos à vista.\n\n**Portabilidade de crédito**: Se sua dívida está em um banco com juros altos, você pode transferi-la para outro com taxa menor.\n\n**O que NÃO fazer**: Nunca aceite a primeira oferta, nunca pague um valor que vai comprometer o mês seguinte.',
        tip: 'Antes de ligar, anote: valor original da dívida, valor atual com juros, o máximo que você pode pagar à vista e em parcelas. Entre na negociação preparado.',
      },
    },
  })

  const stepD3Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-d3-2',
      lessonId: div3.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qD3 = await prisma.question.create({
    data: {
      id: 'q-d3-1',
      stepId: stepD3Quiz.id,
      questionText: 'Qual é a postura mais eficaz ao negociar uma dívida com o credor?',
      explanation: 'Chegar com uma proposta concreta demonstra boa-fé e dá ao credor algo para aceitar ou contra-propor. Isso acelera a negociação e aumenta a chance de um desconto real.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-d3-1-a', questionId: qD3.id, text: 'Esperar o credor fazer a primeira oferta sem dizer nada', isCorrect: false, orderIndex: 0 },
      { id: 'opt-d3-1-b', questionId: qD3.id, text: 'Propor um valor concreto com base no que você pode realmente pagar', isCorrect: true, orderIndex: 1 },
      { id: 'opt-d3-1-c', questionId: qD3.id, text: 'Aceitar a primeira oferta para resolver rápido', isCorrect: false, orderIndex: 2 },
      { id: 'opt-d3-1-d', questionId: qD3.id, text: 'Ignorar a dívida até ela ser negativada', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-d3-3',
      lessonId: div3.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Há alguma dívida que você tem evitado enfrentar? O que te impede de dar o primeiro passo para renegociá-la?',
        hint: 'O medo e a vergonha são barreiras comuns. Mas os credores lidam com isso todos os dias — eles preferem uma solução a mais uma dívida irrecuperável.',
      },
    },
  })

  // ── Lição 4 — Cartão de Crédito Consciente ────────────────────────────
  const div4 = await prisma.lesson.create({
    data: {
      id: 'licao-div-4',
      pathId: dividas.id,
      title: 'Cartão de Crédito Consciente',
      description: 'Como usar o cartão de crédito a seu favor, sem cair na armadilha do rotativo.',
      orderIndex: 3,
      estimatedMins: 3,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-d4-1',
      lessonId: div4.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'O cartão de crédito: ferramenta ou armadilha?',
        body: 'O cartão de crédito não é dinheiro extra — é uma antecipação do seu salário futuro. Usado conscientemente, oferece vantagens reais:\n\n**Vantagens**: Prazo de até 40 dias sem juros, pontos e milhas, proteção em compras online, controle via fatura.\n\n**A regra de ouro**: Pague SEMPRE o valor total da fatura. O rotativo (pagar o mínimo) deve ser considerado uma emergência financeira, não uma opção.\n\n**Limite não é renda**: Muitas pessoas gastam até o limite porque "está disponível". Isso é uma ilusão perigosa.\n\n**Parcelamentos**: Evite parcelar o que você não poderia pagar à vista. Cada parcela é uma promessa de renda futura que você já comprometeu.',
        tip: 'Configure o débito automático para o valor total da fatura. Assim você nunca esquece de pagar e nunca cai no rotativo.',
      },
    },
  })

  const stepD4Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-d4-2',
      lessonId: div4.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qD4 = await prisma.question.create({
    data: {
      id: 'q-d4-1',
      stepId: stepD4Quiz.id,
      questionText: 'Qual é a prática mais importante ao usar o cartão de crédito?',
      explanation: 'Pagar o valor total da fatura é a única forma de usar o cartão sem pagar juros. O pagamento mínimo aciona o rotativo, que cobra as maiores taxas de juros do mercado financeiro brasileiro.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-d4-1-a', questionId: qD4.id, text: 'Usar apenas para compras acima de R$100', isCorrect: false, orderIndex: 0 },
      { id: 'opt-d4-1-b', questionId: qD4.id, text: 'Pagar sempre o valor total da fatura', isCorrect: true, orderIndex: 1 },
      { id: 'opt-d4-1-c', questionId: qD4.id, text: 'Manter o uso abaixo de 30% do limite', isCorrect: false, orderIndex: 2 },
      { id: 'opt-d4-1-d', questionId: qD4.id, text: 'Parcelar compras grandes para não impactar o caixa', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-d4-3',
      lessonId: div4.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Você consegue pagar o total da sua fatura de cartão todo mês? Se não, o que está impedindo isso?',
        hint: 'Se a fatura está acima do que você ganha, o problema não é o cartão — é o orçamento. Volte à Trilha de Orçamento para ajustar.',
      },
    },
  })

  // ── Lição 5 — Saindo do Vermelho de Vez ──────────────────────────────
  const div5 = await prisma.lesson.create({
    data: {
      id: 'licao-div-5',
      pathId: dividas.id,
      title: 'Saindo do Vermelho de Vez',
      description: 'Um plano em três etapas para eliminar dívidas e nunca mais voltar ao endividamento.',
      orderIndex: 4,
      estimatedMins: 4,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-d5-1',
      lessonId: div5.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'O plano de três etapas para sair do vermelho',
        body: 'Sair das dívidas exige um plano estruturado. Aqui está o caminho mais eficaz:\n\n**Etapa 1 — Estancar a hemorragia**: Pare de criar novas dívidas. Corte o cartão se necessário. Sem isso, qualquer esforço é inútil.\n\n**Etapa 2 — Crie uma mini-reserva**: Antes de atacar as dívidas, guarde R$1.000 a R$2.000 em uma conta separada. Isso evita que você recorra ao crédito quando surgir um imprevisto.\n\n**Etapa 3 — Ataque as dívidas**: Use um dos métodos (Bola de Neve ou Avalanche) com disciplina. Cada real de folga vai para a dívida prioritária.\n\nApós quitar tudo: construa a reserva de emergência completa e só depois invista.',
        tip: 'Comemore cada dívida quitada. Essas pequenas vitórias alimentam a disciplina para continuar até o fim.',
      },
    },
  })

  const stepD5Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-d5-2',
      lessonId: div5.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qD5 = await prisma.question.create({
    data: {
      id: 'q-d5-1',
      stepId: stepD5Quiz.id,
      questionText: 'Por que é recomendado guardar uma mini-reserva de R$1.000 ANTES de atacar as dívidas?',
      explanation: 'Sem uma pequena reserva, qualquer imprevisto (carro quebrado, consulta médica) vai te forçar a usar crédito novamente. A mini-reserva quebra esse ciclo e permite focar na quitação das dívidas com segurança.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-d5-1-a', questionId: qD5.id, text: 'Para ter uma aplicação financeira rendendo', isCorrect: false, orderIndex: 0 },
      { id: 'opt-d5-1-b', questionId: qD5.id, text: 'Para evitar recorrer ao crédito em imprevistos enquanto paga as dívidas', isCorrect: true, orderIndex: 1 },
      { id: 'opt-d5-1-c', questionId: qD5.id, text: 'Porque os credores exigem comprovação de reserva', isCorrect: false, orderIndex: 2 },
      { id: 'opt-d5-1-d', questionId: qD5.id, text: 'Para usar como entrada na renegociação', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-d5-3',
      lessonId: div5.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Imagine-se livre de todas as dívidas. O que você faria com o dinheiro que hoje vai para juros e parcelas?',
        hint: 'Visualizar o destino do dinheiro liberado é uma motivação poderosa. Coloque um valor concreto e um sonho concreto.',
      },
    },
  })

  // ══════════════════════════════════════════════════════════════════════
  // TRILHA 4 — INDEPENDÊNCIA FINANCEIRA
  // ══════════════════════════════════════════════════════════════════════
  const independencia = await prisma.learningPath.create({
    data: {
      slug: 'independencia-financeira',
      title: 'Independência Financeira',
      description: 'Entenda o conceito de liberdade financeira, calcule seu número e construa um plano realista para chegar lá.',
      iconName: 'target',
      colorToken: 'rose',
      orderIndex: 3,
      isPublished: true,
    },
  })

  // ── Lição 1 — O que é Independência Financeira? ───────────────────────
  const if1 = await prisma.lesson.create({
    data: {
      id: 'licao-if-1',
      pathId: independencia.id,
      title: 'O que é Independência Financeira?',
      description: 'Entenda o conceito e os diferentes estágios do caminho para a liberdade financeira.',
      orderIndex: 0,
      estimatedMins: 4,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-f1-1',
      lessonId: if1.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'O que significa ser financeiramente independente?',
        body: 'Independência financeira significa ter renda passiva suficiente para cobrir todas as suas despesas — sem precisar trabalhar para viver.\n\nNão é sobre ser milionário. É sobre atingir o ponto em que trabalhar vira uma escolha, não uma obrigação.\n\n**Os estágios da independência financeira:**\n\n1. **Solvência**: Sem dívidas, contas em dia.\n2. **Estabilidade**: Reserva de emergência completa.\n3. **Liberdade**: Renda passiva cobre pelo menos parte das despesas.\n4. **Independência**: Renda passiva cobre 100% das despesas.\n5. **Abundância**: Renda passiva supera as despesas — total paz financeira.',
        tip: 'A IF não é um destino binário — é uma jornada em estágios. Cada nível alcançado já muda sua relação com o trabalho e com o dinheiro.',
      },
    },
  })

  const stepF1Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-f1-2',
      lessonId: if1.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qF1 = await prisma.question.create({
    data: {
      id: 'q-f1-1',
      stepId: stepF1Quiz.id,
      questionText: 'O que define o estado de independência financeira plena?',
      explanation: 'Independência financeira significa que sua renda passiva (de investimentos, aluguéis, dividendos) é suficiente para pagar todas as suas despesas, tornando o trabalho uma opção e não uma necessidade.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-f1-1-a', questionId: qF1.id, text: 'Ter R$1 milhão no banco', isCorrect: false, orderIndex: 0 },
      { id: 'opt-f1-1-b', questionId: qF1.id, text: 'Renda passiva igual ou superior às despesas mensais', isCorrect: true, orderIndex: 1 },
      { id: 'opt-f1-1-c', questionId: qF1.id, text: 'Não ter nenhum tipo de dívida', isCorrect: false, orderIndex: 2 },
      { id: 'opt-f1-1-d', questionId: qF1.id, text: 'Ter um emprego de alta renda', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-f1-3',
      lessonId: if1.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'O que independência financeira significaria para você? Quanto você precisaria receber por mês para considerar-se independente?',
        hint: 'Pense no seu estilo de vida atual. Não precisa ser luxuoso — apenas o suficiente para viver com conforto sem depender de um salário.',
      },
    },
  })

  // ── Lição 2 — Calculando Seu Número ──────────────────────────────────
  const if2 = await prisma.lesson.create({
    data: {
      id: 'licao-if-2',
      pathId: independencia.id,
      title: 'Calculando Seu Número',
      description: 'Use a Regra dos 4% para descobrir exatamente quanto patrimônio você precisa acumular.',
      orderIndex: 1,
      estimatedMins: 5,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-f2-1',
      lessonId: if2.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'A Regra dos 4% e seu número mágico',
        body: 'A Regra dos 4% vem de um estudo americano (Trinity Study) que mostrou que, historicamente, você pode retirar 4% do seu patrimônio por ano indefinidamente sem esgotá-lo — porque o investimento rende mais que a retirada.\n\n**Fórmula do seu número:**\n\n> Patrimônio necessário = Despesa mensal × 12 ÷ 4% = Despesa mensal × 300\n\n**Exemplos:**\n- Precisa de R$3.000/mês → R$900.000\n- Precisa de R$5.000/mês → R$1.500.000\n- Precisa de R$10.000/mês → R$3.000.000\n\nNo contexto brasileiro, muitos especialistas sugerem usar 3% ao invés de 4% para ser mais conservador, dado o ambiente econômico local.',
        tip: 'Reduza suas despesas mensais e seu "número" encolhe consideravelmente. Cada R$100 a menos nas despesas equivale a R$30.000 a menos de patrimônio necessário.',
      },
    },
  })

  const stepF2Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-f2-2',
      lessonId: if2.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qF2 = await prisma.question.create({
    data: {
      id: 'q-f2-1',
      stepId: stepF2Quiz.id,
      questionText: 'Usando a Regra dos 4%, qual é o patrimônio necessário para retirar R$5.000 por mês indefinidamente?',
      explanation: 'Pela Regra dos 4%: patrimônio = despesa mensal × 12 ÷ 4% = R$5.000 × 300 = R$1.500.000. Com esse patrimônio investido, a retirada de 4% ao ano equivale a R$60.000 anuais ou R$5.000 mensais.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-f2-1-a', questionId: qF2.id, text: 'R$600.000', isCorrect: false, orderIndex: 0 },
      { id: 'opt-f2-1-b', questionId: qF2.id, text: 'R$1.000.000', isCorrect: false, orderIndex: 1 },
      { id: 'opt-f2-1-c', questionId: qF2.id, text: 'R$1.500.000', isCorrect: true, orderIndex: 2 },
      { id: 'opt-f2-1-d', questionId: qF2.id, text: 'R$2.500.000', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-f2-3',
      lessonId: if2.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Aplique a fórmula ao seu caso: multiplique suas despesas mensais atuais por 300. Qual é o seu número? Esse valor parece atingível em 10, 15 ou 20 anos?',
        hint: 'Não precisa ser preciso — uma estimativa já é útil. O objetivo é tornar a independência financeira um alvo concreto, não um sonho vago.',
      },
    },
  })

  // ── Lição 3 — Construindo Múltiplas Rendas ────────────────────────────
  const if3 = await prisma.lesson.create({
    data: {
      id: 'licao-if-3',
      pathId: independencia.id,
      title: 'Construindo Múltiplas Rendas',
      description: 'Como diversificar suas fontes de renda ativa e passiva para acelerar a jornada.',
      orderIndex: 2,
      estimatedMins: 4,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-f3-1',
      lessonId: if3.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'Renda ativa, renda passiva e o caminho entre elas',
        body: '**Renda ativa**: Você troca tempo por dinheiro. Salário, freelance, serviços. Para quando você para.\n\n**Renda passiva**: Dinheiro que entra sem exigir seu tempo contínuo. Dividendos, aluguéis (físicos ou via FII), royalties, renda de produtos digitais.\n\n**Como construir renda passiva:**\n- **Dividendos de ações**: Empresas lucrativas distribuem parte do lucro a acionistas regularmente.\n- **FIIs**: Rendimentos mensais de imóveis sem precisar comprar um imóvel físico.\n- **Renda digital**: Cursos, e-books, infoprodutos geram receita recorrente após a criação.\n- **Aluguel**: O clássico, porém exige capital alto e gestão.\n\nA transição da renda ativa para a passiva é o coração da independência financeira.',
        tip: 'Você não precisa abandonar a renda ativa agora. O caminho é usar parte da renda ativa para construir ativos que geram renda passiva.',
      },
    },
  })

  const stepF3Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-f3-2',
      lessonId: if3.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qF3 = await prisma.question.create({
    data: {
      id: 'q-f3-1',
      stepId: stepF3Quiz.id,
      questionText: 'Qual das fontes abaixo representa renda passiva?',
      explanation: 'Dividendos são pagamentos feitos pelas empresas aos seus acionistas com base no lucro. Você recebe esse dinheiro sem precisar trabalhar ativamente — é a definição de renda passiva.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-f3-1-a', questionId: qF3.id, text: 'Salário de um emprego CLT', isCorrect: false, orderIndex: 0 },
      { id: 'opt-f3-1-b', questionId: qF3.id, text: 'Honorários de um serviço prestado', isCorrect: false, orderIndex: 1 },
      { id: 'opt-f3-1-c', questionId: qF3.id, text: 'Dividendos recebidos de ações', isCorrect: true, orderIndex: 2 },
      { id: 'opt-f3-1-d', questionId: qF3.id, text: 'Comissão de vendas', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-f3-3',
      lessonId: if3.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Além do seu trabalho principal, qual fonte de renda passiva você poderia começar a construir nos próximos 12 meses?',
        hint: 'Pense em suas habilidades, ativos que já tem (tempo, conhecimento, pequeno capital) e qual tipo de renda passiva se encaixa melhor no seu momento de vida.',
      },
    },
  })

  // ── Lição 4 — A Psicologia do Dinheiro ───────────────────────────────
  const if4 = await prisma.lesson.create({
    data: {
      id: 'licao-if-4',
      pathId: independencia.id,
      title: 'A Psicologia do Dinheiro',
      description: 'Por que comportamento importa mais do que inteligência nas finanças pessoais.',
      orderIndex: 3,
      estimatedMins: 4,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-f4-1',
      lessonId: if4.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'O inimigo mora dentro de nós',
        body: 'A maior ameaça às suas finanças não é o mercado, a inflação ou o governo. É o seu próprio comportamento.\n\n**Desconto hiperbólico**: Nosso cérebro supervaloriza o presente em detrimento do futuro. R$100 hoje parecem valer mais do que R$200 em um ano.\n\n**Viés do status quo**: Resistimos a mudar hábitos mesmo quando sabemos que não estão funcionando.\n\n**Dinheiro emocional**: Compramos por impulso, ansiedade, inveja ou tristeza — não por necessidade.\n\n**A solução não é força de vontade — é design**: Automatize investimentos, remova o cartão de crédito das compras impulsivas, torne o gasto consciente mais fácil do que o impulsivo.',
        tip: 'Morgan Housel escreveu: "Ser bom com dinheiro tem pouco a ver com inteligência e muito a ver com comportamento." O conhecimento sem ação não muda nada.',
      },
    },
  })

  const stepF4Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-f4-2',
      lessonId: if4.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qF4 = await prisma.question.create({
    data: {
      id: 'q-f4-1',
      stepId: stepF4Quiz.id,
      questionText: 'Qual é a estratégia mais eficaz para superar os vieses comportamentais nas finanças?',
      explanation: 'Automatizar decisões financeiras (investimento automático, débito da fatura, aportes programados) remove o esforço e a oportunidade de agir por impulso. O sistema trabalha por você mesmo quando a motivação oscila.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-f4-1-a', questionId: qF4.id, text: 'Ter mais disciplina e força de vontade', isCorrect: false, orderIndex: 0 },
      { id: 'opt-f4-1-b', questionId: qF4.id, text: 'Automatizar decisões financeiras para não depender de motivação', isCorrect: true, orderIndex: 1 },
      { id: 'opt-f4-1-c', questionId: qF4.id, text: 'Estudar mais sobre finanças para tomar melhores decisões', isCorrect: false, orderIndex: 2 },
      { id: 'opt-f4-1-d', questionId: qF4.id, text: 'Evitar pensar sobre dinheiro para não criar ansiedade', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-f4-3',
      lessonId: if4.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Qual hábito financeiro você gostaria de automatizar para não depender da sua força de vontade? Como você poderia colocar isso em prática esta semana?',
        hint: 'Pense pequeno e concreto: uma transferência automática, um débito em conta, um lembrete semanal. A mudança menor que realmente acontece supera a grande que fica no plano.',
      },
    },
  })

  // ── Lição 5 — Seu Plano de 10 Anos ───────────────────────────────────
  const if5 = await prisma.lesson.create({
    data: {
      id: 'licao-if-5',
      pathId: independencia.id,
      title: 'Seu Plano de 10 Anos',
      description: 'Como definir metas financeiras SMART e construir um roteiro concreto para a independência.',
      orderIndex: 4,
      estimatedMins: 5,
      isPublished: true,
    },
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-f5-1',
      lessonId: if5.id,
      stepType: 'READ',
      orderIndex: 0,
      content: {
        type: 'READ',
        heading: 'Construindo seu roteiro financeiro',
        body: 'Metas vagas falham. "Quero ser rico" não te leva a lugar nenhum. Metas SMART (Específicas, Mensuráveis, Atingíveis, Relevantes e com Prazo) funcionam.\n\n**Exemplo de meta SMART:** "Quero ter R$300.000 investidos em Tesouro IPCA+ e ações até dezembro de 2034, aportando R$1.500 por mês a partir de março de 2025."\n\n**Marcos intermediários sugeridos:**\n- **1 ano**: Zerar dívidas e montar reserva de emergência.\n- **3 anos**: Primeiro R$50.000 investidos.\n- **5 anos**: R$150.000 e renda passiva cobrindo pelo menos 20% das despesas.\n- **10 anos**: Atingir ou se aproximar do seu número de independência financeira.\n\nRevisão anual obrigatória: compare onde você está com onde deveria estar.',
        tip: 'Escreva sua meta. Pessoas que escrevem seus objetivos têm significativamente mais chance de alcançá-los do que as que apenas pensam neles.',
      },
    },
  })

  const stepF5Quiz = await prisma.lessonStep.create({
    data: {
      id: 'step-f5-2',
      lessonId: if5.id,
      stepType: 'QUIZ',
      orderIndex: 1,
      content: { type: 'QUIZ' },
    },
  })

  const qF5 = await prisma.question.create({
    data: {
      id: 'q-f5-1',
      stepId: stepF5Quiz.id,
      questionText: 'O que torna uma meta financeira mais fácil de alcançar?',
      explanation: 'Metas SMART são específicas, mensuráveis, atingíveis, relevantes e com prazo definido. Esses critérios transformam desejos vagos em planos concretos com métricas claras de acompanhamento.',
    },
  })

  await prisma.questionOption.createMany({
    data: [
      { id: 'opt-f5-1-a', questionId: qF5.id, text: 'Ser ambiciosa e inspiradora', isCorrect: false, orderIndex: 0 },
      { id: 'opt-f5-1-b', questionId: qF5.id, text: 'Ser específica, mensurável e com prazo definido (SMART)', isCorrect: true, orderIndex: 1 },
      { id: 'opt-f5-1-c', questionId: qF5.id, text: 'Ser compartilhada com amigos para criar responsabilidade', isCorrect: false, orderIndex: 2 },
      { id: 'opt-f5-1-d', questionId: qF5.id, text: 'Ser flexível para mudar conforme necessário', isCorrect: false, orderIndex: 3 },
    ],
  })

  await prisma.lessonStep.create({
    data: {
      id: 'step-f5-3',
      lessonId: if5.id,
      stepType: 'REFLECT',
      orderIndex: 2,
      content: {
        type: 'REFLECT',
        prompt: 'Escreva sua meta financeira para os próximos 10 anos no formato SMART: valor específico, prazo definido e o propósito por trás dela.',
        hint: 'O "porquê" é o mais importante. Uma meta sem propósito não sobrevive aos primeiros obstáculos.',
      },
    },
  })

  console.log('✓ Seed concluído — 4 trilhas, 20 lições com conteúdo completo')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
