// =========================================
// QUIZ INTERATIVO - todas as perguntas aparecem de uma vez
// Perguntas baseadas no artigo "Computação sob Pressão da Guerra".
// Para trocar as perguntas, edite apenas o array "perguntas" (máx. 5).
// "correta" é o índice (começando em 0) da alternativa certa.
// =========================================
const perguntas = [
    {
        texto: "Em que ano a existência do Colossus foi reconhecida publicamente?",
        opcoes: ["1944", "1950", "1975"],
        correta: 2,
        explicacao: "Os integrantes de Bletchley Park juraram sigilo, e a existência do Colossus só foi reconhecida publicamente em 1975."
    },
    {
        texto: "Em Los Alamos, o que levou os operadores do Destacamento de Engenharia Especial a melhorar a eficiência do trabalho?",
        opcoes: [
            "Saber o que estavam calculando",
            "A chegada de máquinas eletrônicas",
            "A substituição dos cartões perfurados por cabos"
        ],
        correta: 0,
        explicacao: "Depois que Feynman obteve permissão para contar o propósito do cálculo, os operadores passaram de menos de uma simulação por mês para doze problemas em quatro meses."
    },
    {
        texto: "Quais são as duas categorias de erros encontradas por Stuart nos exemplos de programação do ENIAC?",
        opcoes: [
            "Erros de hardware e erros de energia",
            "Erros notacionais e erros de concorrência e temporização",
            "Erros de memória e erros de compilação"
        ],
        correta: 1,
        explicacao: "A maioria era notacional (copiar ou atualizar parâmetros de forma inconsistente); a outra categoria reunia erros de concorrência e temporização."
    },
    {
        texto: "Qual destes era um mecanismo de depuração do ENIAC?",
        opcoes: [
            "Depurador em linguagem de alto nível",
            "Pontos de parada, desenvolvidos pelas primeiras programadoras",
            "Registro automático de erros em disco"
        ],
        correta: 1,
        explicacao: "O ENIAC tinha lâmpadas de néon, modo de passo único e a técnica de pontos de parada criada pelas primeiras programadoras."
    },
    {
        texto: "Qual princípio de Turing está na base do projeto do ACE?",
        opcoes: [
            "Programar a máquina por chaves e cabos",
            "Calcular apenas com cartões perfurados",
            "Controlar a máquina por instruções codificadas armazenadas na memória"
        ],
        correta: 2,
        explicacao: "O ACE foi projetado em 1945 segundo o princípio do programa armazenado, base do computador moderno."
    }
];

const container = document.getElementById("quiz-container");
let respondidas = {};   // { indiceDaPergunta: indiceDaOpcaoEscolhida }

function montarQuiz() {
    respondidas = {};
    container.innerHTML = `
        <div class="quiz-topo">
            <div class="quiz-progresso" id="progresso"></div>
            <div class="barra"><div class="barra-preenchida" id="barra"></div></div>
        </div>
        <div id="lista-perguntas"></div>
        <div id="resultado-quiz"></div>
    `;

    const lista = document.getElementById("lista-perguntas");
    const letras = ["A", "B", "C", "D", "E"];

    perguntas.forEach((p, qi) => {
        const bloco = document.createElement("div");
        bloco.className = "pergunta";
        bloco.id = "pergunta-" + qi;

        const titulo = document.createElement("p");
        titulo.className = "quiz-pergunta";
        titulo.textContent = `${qi + 1}. ${p.texto}`;
        bloco.appendChild(titulo);

        p.opcoes.forEach((texto, oi) => {
            const botao = document.createElement("button");
            botao.type = "button";
            botao.className = "opcao";
            botao.textContent = `${letras[oi]}) ${texto}`;
            botao.addEventListener("click", () => responder(qi, oi));
            bloco.appendChild(botao);
        });

        const feedback = document.createElement("div");
        feedback.id = "feedback-" + qi;
        bloco.appendChild(feedback);

        lista.appendChild(bloco);
    });

    atualizarProgresso();
}

function responder(qi, oi) {
    if (respondidas[qi] !== undefined) return;
    respondidas[qi] = oi;

    const p = perguntas[qi];
    const acertou = oi === p.correta;
    const botoes = document.querySelectorAll(`#pergunta-${qi} .opcao`);

    botoes.forEach((b, i) => {
        b.disabled = true;
        if (i === p.correta) b.classList.add("correta");
        else if (i === oi) b.classList.add("errada");
    });

    document.getElementById("feedback-" + qi).innerHTML =
        `<div class="explicacao"><strong>${acertou ? "Correto!" : "Incorreto."}</strong> ${p.explicacao}</div>`;

    atualizarProgresso();

    if (Object.keys(respondidas).length === perguntas.length) mostrarResultado();
}

function atualizarProgresso() {
    const feitas = Object.keys(respondidas).length;
    document.getElementById("progresso").textContent =
        `${feitas} de ${perguntas.length} perguntas respondidas`;
    document.getElementById("barra").style.width = (feitas / perguntas.length * 100) + "%";
}

function mostrarResultado() {
    const total = perguntas.length;
    const acertos = perguntas.filter((p, i) => respondidas[i] === p.correta).length;

    let mensagem;
    if (acertos === total) mensagem = "Perfeito! Você domina o assunto.";
    else if (acertos >= total / 2) mensagem = "Muito bom! Revise os pontos que errou.";
    else mensagem = "Vale reler o conteúdo do site e tentar de novo.";

    const area = document.getElementById("resultado-quiz");
    area.innerHTML = `
        <div class="pergunta resultado-final">
            <h3>Você acertou ${acertos} de ${total}</h3>
            <p>${mensagem}</p>
            <div class="quiz-acoes">
                <button type="button" class="btn-enviar" id="reiniciar">Refazer quiz</button>
            </div>
        </div>
    `;
    document.getElementById("reiniciar").addEventListener("click", () => {
        montarQuiz();
        document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
    });
    area.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

montarQuiz();
