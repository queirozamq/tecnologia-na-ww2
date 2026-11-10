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
let respondidas = {};

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
    const fragmento = document.createDocumentFragment();

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

        fragmento.appendChild(bloco);
    });

    lista.appendChild(fragmento);
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
        `<div class="explicacao ${acertou ? "certo" : "erro"}"><strong>${acertou ? "Correto!" : "Incorreto."}</strong> ${p.explicacao}</div>`;

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


// =========================================
// INTERAÇÕES E RECURSOS DO SITE
// =========================================

// 1) Menu Mobile Hambúrguer
const btnMenuMobile = document.getElementById("btn-menu-mobile");
const menuPrincipal = document.getElementById("menu-principal");

btnMenuMobile.addEventListener("click", () => {
    const aberto = menuPrincipal.classList.toggle("aberto");
    btnMenuMobile.classList.toggle("ativo", aberto);
    btnMenuMobile.setAttribute("aria-expanded", aberto);
});

// Fechar menu mobile ao clicar em um link
menuPrincipal.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        menuPrincipal.classList.remove("aberto");
        btnMenuMobile.classList.remove("ativo");
        btnMenuMobile.setAttribute("aria-expanded", "false");
    });
});

// 2) Barra de progresso de leitura
const barraLeitura = document.getElementById("progresso-leitura");
function atualizarLeitura() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    barraLeitura.style.width = pct + "%";
}
window.addEventListener("scroll", atualizarLeitura, { passive: true });
atualizarLeitura();

// 3) Link ativo no menu conforme seção visível
const linksMenu = document.querySelectorAll(".menu a");
const secoes = [...linksMenu].map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
const observador = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
        if (!e.isIntersecting) return;
        linksMenu.forEach(a => a.classList.toggle("ativo", a.getAttribute("href") === "#" + e.target.id));
    });
}, { rootMargin: "-45% 0px -50% 0px" });
secoes.forEach(sec => observador.observe(sec));

// 4) Resumo do hero: expandir / recolher
const resumoHero = document.getElementById("resumo-hero");
const btnResumo = document.getElementById("btn-resumo");
btnResumo.addEventListener("click", () => {
    const aberto = resumoHero.classList.toggle("aberto");
    btnResumo.textContent = aberto ? "Recolher resumo" : "Ler resumo completo";
    btnResumo.setAttribute("aria-expanded", aberto);
});

// 5) Linha do tempo: abre seção do artigo ao clicar no marco
document.querySelectorAll(".tl a").forEach(link => {
    link.addEventListener("click", () => {
        const alvo = document.querySelector(link.getAttribute("href"));
        if (alvo && alvo.tagName === "DETAILS") alvo.open = true;
    });
});

// 6) Abrir / fechar todas as seções do artigo
const secoesArtigo = document.querySelectorAll(".secao-artigo");
const btnTudo = document.getElementById("btn-abrir-tudo");
function atualizarBotaoTudo() {
    const todasAbertas = [...secoesArtigo].every(d => d.open);
    btnTudo.textContent = todasAbertas ? "Fechar todas" : "Abrir todas";
}
btnTudo.addEventListener("click", () => {
    const abrir = ![...secoesArtigo].every(d => d.open);
    secoesArtigo.forEach(d => d.open = abrir);
    atualizarBotaoTudo();
});
secoesArtigo.forEach(d => d.addEventListener("toggle", atualizarBotaoTudo));
atualizarBotaoTudo();

// 7) Calculadora de tempo estimado de leitura
function calcularTempoLeitura() {
    const textoArtigo = document.getElementById("artigo").innerText;
    const palavras = textoArtigo.trim().split(/\s+/).length;
    const minutos = Math.ceil(palavras / 200); // Média de 200 palavras por minuto
    document.getElementById("tempo-leitura").textContent = `⏱ Tempo estimado de leitura: ~${minutos} min (${palavras} palavras)`;
}
calcularTempoLeitura();

// 8) Sistema de Feedback (Avaliação por Estrelas + localStorage)
let avaliacaoSelecionada = 0;
const estrelas = document.querySelectorAll(".estrela");
const formFeedback = document.getElementById("form-feedback");
const containerFeedbacksSalvos = document.getElementById("lista-feedbacks-salvos");

estrelas.forEach(estrela => {
    estrela.addEventListener("click", () => {
        avaliacaoSelecionada = parseInt(estrela.getAttribute("data-valor"), 10);
        atualizarEstrelasVisual();
    });
});

function atualizarEstrelasVisual() {
    estrelas.forEach(estrela => {
        const val = parseInt(estrela.getAttribute("data-valor"), 10);
        estrela.classList.toggle("ativa", val <= avaliacaoSelecionada);
    });
}

function carregarFeedbacksSalvos() {
    const salvos = JSON.parse(localStorage.getItem("feedbacks_ww2") || "[]");
    if (salvos.length === 0) return;
    
    containerFeedbacksSalvos.innerHTML = `<h3>Avaliações recentes enviadas:</h3>` + salvos.map(f => `
        <div class="item-feedback-salvo">
            <header>
                <strong>${f.nome}</strong>
                <span>${"★".repeat(f.avaliacao)}${"☆".repeat(5 - f.avaliacao)}</span>
            </header>
            <p>${f.mensagem}</p>
        </div>
    `).join("");
}

formFeedback.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome-feedback").value.trim() || "Anônimo";
    const mensagem = document.getElementById("mensagem-feedback").value.trim();

    if (!mensagem) return;

    const novoFeedback = {
        nome,
        mensagem,
        avaliacao: avaliacaoSelecionada || 5,
        data: new Date().toLocaleDateString("pt-BR")
    };

    const salvos = JSON.parse(localStorage.getItem("feedbacks_ww2") || "[]");
    salvos.unshift(novoFeedback);
    localStorage.setItem("feedbacks_ww2", JSON.stringify(salvos));

    formFeedback.reset();
    avaliacaoSelecionada = 0;
    atualizarEstrelasVisual();

    const avisoSucesso = document.getElementById("feedback-mensagem-sucesso");
    avisoSucesso.hidden = false;
    setTimeout(() => { avisoSucesso.hidden = true; }, 4000);

    carregarFeedbacksSalvos();
});

carregarFeedbacksSalvos();

// 9) Medição otimizada da altura do cabeçalho com Debounce
const cabecalho = document.querySelector("header");
function medirCabecalho() {
    if (cabecalho) {
        document.documentElement.style.setProperty("--header-h", cabecalho.offsetHeight + "px");
    }
}

let timeoutResize;
window.addEventListener("resize", () => {
    clearTimeout(timeoutResize);
    timeoutResize = setTimeout(medirCabecalho, 100);
});
window.addEventListener("load", medirCabecalho);
medirCabecalho();
