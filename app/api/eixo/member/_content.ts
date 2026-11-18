import "server-only";

export type EixoLesson={
  day:number;
  phase:string;
  title:string;
  estimatedMinutes:number;
  intro:string;
  steps:{title:string;description:string}[];
  closing:string;
};
export type EixoBonus={
  id:number;
  title:string;
  subtitle:string;
  duration:string;
  sections:{title:string;paragraphs:string[]}[];
};

export const EIXO_LESSONS:EixoLesson[]=[
  {day:1,phase:"RECONHECER",title:"Tire o peso da cobrança",estimatedMinutes:6,
    intro:"Hoje não é sobre melhorar um número. É sobre perceber como a expectativa interfere na experiência.",
    steps:[
      {title:"Dê nome ao pensamento",description:"Anote a frase que mais surge antes da intimidade, por exemplo: “preciso dar conta”. Não discuta com ela; apenas identifique."},
      {title:"Separe fato de previsão",description:"Pergunte: “isso está acontecendo agora ou é o que temo que aconteça?” Reconhecer essa diferença ajuda a reduzir antecipações."},
      {title:"Defina uma intenção leve",description:"Troque uma meta de desempenho por uma intenção possível: “vou prestar atenção ao momento e comunicar o que sinto”."}
    ],closing:"O objetivo do primeiro dia é perceber, não se cobrar por mudar imediatamente."},
  {day:2,phase:"DESACELERAR",title:"Respire antes de se cobrar",estimatedMinutes:5,
    intro:"Uma pausa curta pode oferecer espaço para observar o corpo sem transformar a respiração em uma nova obrigação.",
    steps:[
      {title:"Encontre uma posição confortável",description:"Sente-se com os pés apoiados e solte a mandíbula e os ombros."},
      {title:"Respire naturalmente",description:"Por cerca de dois minutos, perceba o ar entrando e saindo, sem prender ou forçar a respiração."},
      {title:"Observe o ambiente",description:"Identifique três coisas que pode ver, duas que pode ouvir e uma sensação de contato com o corpo."}
    ],closing:"Se respirar de determinada maneira causar tontura ou desconforto, volte à respiração espontânea."},
  {day:3,phase:"EXPECTATIVAS",title:"Questione o medo de falhar",estimatedMinutes:7,
    intro:"A intimidade não é uma prova com nota de aprovação. Você pode revisar as expectativas que mais pesam.",
    steps:[
      {title:"Escreva sua exigência",description:"Complete: “Para me sentir bem, acho que preciso...”"},
      {title:"Busque uma alternativa",description:"Imagine o que diria a um amigo na mesma situação, com respeito e menos julgamento."},
      {title:"Experimente outra frase",description:"“Meu valor não depende de uma resposta do corpo nem de uma duração específica.”"}
    ],closing:"A prática serve para reduzir a dureza do diálogo interno, não para garantir um resultado físico."},
  {day:4,phase:"CONEXÃO",title:"Abra espaço para conversar",estimatedMinutes:8,
    intro:"Conversas claras podem diminuir a sensação de que você precisa lidar com tudo sozinho.",
    steps:[
      {title:"Escolha um momento neutro",description:"Prefira conversar fora da intimidade, sem a pressão de tomar uma decisão imediata."},
      {title:"Use a primeira pessoa",description:"Experimente: “Às vezes fico preocupado em corresponder e queria falar disso sem vergonha.”"},
      {title:"Pergunte e escute",description:"Ouça o que a outra pessoa sente, respeitando seus limites, seu ritmo e o consentimento."}
    ],closing:"Conversar não obriga ninguém a continuar uma relação ou uma situação íntima."},
  {day:5,phase:"PRESENÇA",title:"Volte sua atenção ao presente",estimatedMinutes:6,
    intro:"Quando a cabeça corre para o que pode dar errado, é possível praticar um retorno gentil ao agora.",
    steps:[
      {title:"Localize a autocobrança",description:"Perceba quando começa a monitorar resultados, comparações ou expectativas."},
      {title:"Encontre uma âncora",description:"Escolha algo neutro para notar: apoio dos pés, temperatura do ambiente ou um som."},
      {title:"Faça uma pausa, se precisar",description:"Lembre que diminuir o ritmo, falar ou parar são escolhas legítimas."}
    ],closing:"Presença não é ignorar desconfortos nem desconsiderar necessidades do parceiro."},
  {day:6,phase:"ROTINA",title:"Cuide do contexto",estimatedMinutes:7,
    intro:"Sono, estresse, uso de substâncias, relações e saúde podem influenciar a vida sexual de maneiras diferentes.",
    steps:[
      {title:"Observe sua semana",description:"Considere períodos de descanso, tensão, atividade física e como você se sentiu."},
      {title:"Escolha um ajuste simples",description:"Planeje uma ação realista de autocuidado que não dependa de alcançar um desempenho."},
      {title:"Identifique quando buscar ajuda",description:"Se houver dor, alterações persistentes de ereção, sofrimento intenso ou efeitos de medicamentos, converse com um profissional habilitado."}
    ],closing:"Evite interromper medicamentos prescritos sem orientação médica."},
  {day:7,phase:"REVISÃO",title:"Reconheça seu próprio ritmo",estimatedMinutes:9,
    intro:"Chegou a hora de olhar a experiência com curiosidade, sem transformar o roteiro em prova.",
    steps:[
      {title:"Compare suas reflexões",description:"Que pensamento você identifica com mais facilidade hoje? O que continua difícil?"},
      {title:"Escolha o que vale repetir",description:"Selecione uma prática de presença e uma forma de comunicação que fizeram sentido para você."},
      {title:"Defina o próximo passo",description:"Continue no seu ritmo ou busque apoio de um profissional de saúde se a preocupação persistir."}
    ],closing:"Concluir sete dias significa ter explorado ferramentas educativas, não receber um diagnóstico ou uma promessa clínica."}
];

export const EIXO_BONUSES:EixoBonus[]=[
  {id:1,title:"Protocolo SOS — Antes de Transar",subtitle:"Uma pausa de cinco minutos para desacelerar antes da hora H.",duration:"5 MINUTOS",
    sections:[
      {title:"1. Pare de tentar resolver tudo agora",paragraphs:["Dê a si mesmo permissão para fazer uma pausa. Não precisa provar nada nem estabelecer um resultado antes de começar."]},
      {title:"2. Relaxe onde existe tensão",paragraphs:["Note seus ombros, mandíbula e mãos. Solte a musculatura gradualmente, sem forçar movimentos ou prender a respiração."]},
      {title:"3. Observe o presente",paragraphs:["Perceba o que existe de concreto ao redor: uma luz, um som ou um contato confortável. Se surgirem pensamentos de cobrança, identifique-os sem brigar com eles."]},
      {title:"4. Lembre do consentimento",paragraphs:["Estar presente também é poder conversar, diminuir o ritmo ou parar a qualquer momento."]},
      {title:"5. Escolha sua intenção",paragraphs:["Uma sugestão: “quero viver esse momento com respeito, conforto e diálogo”. Nenhum exercício garante um resultado sexual específico."]}
    ]},
  {id:2,title:"Manual — E Se Eu Brochar?",subtitle:"Como lidar com o medo de perder a ereção sem transformar o momento em fracasso.",duration:"4 PARTES",
    sections:[
      {title:"Entenda a reação",paragraphs:["Mudanças de ereção podem acontecer por muitos fatores, incluindo cansaço, ansiedade, contexto e condições de saúde. Um episódio não define sua masculinidade."]},
      {title:"Evite a armadilha da comparação",paragraphs:["Histórias, imagens e números na internet não são uma referência confiável para medir sua intimidade. Foque em conforto, prazer compartilhado e comunicação."]},
      {title:"Tenha uma frase pronta",paragraphs:["“Fiquei um pouco nervoso. Podemos ir com calma?” Uma conversa simples pode ser mais útil do que tentar esconder o que está acontecendo."]},
      {title:"Saiba quando procurar apoio",paragraphs:["Se alterações persistirem ou causarem sofrimento, um urologista ou profissional habilitado pode ajudar a investigar causas físicas e psicológicas. Não se automedique."]}
    ]},
  {id:3,title:"Sexo Sem Vergonha — Guia de Conversas",subtitle:"Frases para falar sobre insegurança, desejo e expectativas.",duration:"5 SITUAÇÕES",
    sections:[
      {title:"Quando quiser falar da pressão",paragraphs:["“Tenho sentido uma cobrança interna com o sexo e queria dividir isso com você.”"]},
      {title:"Quando quiser ir mais devagar",paragraphs:["“Podemos desacelerar um pouco? Quero aproveitar nosso tempo sem pressa.”"]},
      {title:"Quando estiver inseguro",paragraphs:["“Às vezes fico com medo de não corresponder. Prefiro conversar do que fingir que está tudo bem.”"]},
      {title:"Quando a outra pessoa demonstrar dúvida",paragraphs:["“Quero entender como você se sente também. O que faria esse momento ficar mais confortável?”"]},
      {title:"Quando quiser definir limites",paragraphs:["“Hoje prefiro parar por aqui.” Limites e consentimento são importantes para todas as pessoas envolvidas."]}
    ]},
  {id:4,title:"Modo Hora H — Mais Presença, Menos Pressão",subtitle:"Um roteiro educativo para antes, durante e depois da intimidade.",duration:"3 MOMENTOS",
    sections:[
      {title:"Antes",paragraphs:["Pergunte-se se está confortável e se há algo que precise comunicar. Não use o encontro como uma prova de desempenho."]},
      {title:"Durante",paragraphs:["Mantenha espaço para diálogo, atenção às sensações e ajustes de ritmo. Se houver desconforto, converse ou pare."]},
      {title:"Depois",paragraphs:["Em vez de dar uma nota ao encontro, reflita sobre conexão, respeito e como se sentiu. O que gostaria de conversar para a próxima vez?"]}
    ]},
  {id:5,title:"Entenda Sua Ereção — Corpo, Mente e Ansiedade",subtitle:"Informações básicas sobre os fatores que podem influenciar a resposta sexual.",duration:"GUIA EDUCATIVO",
    sections:[
      {title:"Uma resposta de muitos fatores",paragraphs:["Ereções dependem de interações entre sistema nervoso, circulação, hormônios, emoções e contexto. Nenhum quiz identifica sozinho a causa de uma dificuldade."]},
      {title:"O papel da ansiedade",paragraphs:["A preocupação com desempenho pode aumentar a vigilância sobre o corpo e tirar a atenção da experiência. Mas nem toda alteração tem origem emocional."]},
      {title:"Hábitos e saúde",paragraphs:["Sono, estresse, tabaco, álcool, medicamentos e condições clínicas podem ter influência. Mudanças de tratamento devem ser discutidas com o profissional responsável."]},
      {title:"Quando buscar avaliação",paragraphs:["Se as dificuldades forem recorrentes, houver dor, perda importante de libido ou outros sintomas, procure orientação médica. É possível receber ajuda sem julgamento."]}
    ]}
];
