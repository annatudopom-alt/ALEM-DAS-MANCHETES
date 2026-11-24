/* Funcionalidades do Além das Manchetes em JavaScript puro */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Navegação móvel
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const opened = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(opened));
      menuToggle.textContent = opened ? "×" : "☰";
    });
    $$("a", mainNav).forEach(link => link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    }));
  }

  // Verificador educativo de manchetes: analisa padrões de linguagem, não autentica notícias.
  const verifyForm = $("#verifyForm");
  if (verifyForm) {
    verifyForm.addEventListener("submit", event => {
      event.preventDefault();
      const input = $("#verifyInput");
      const button = $("#verifyButton");
      const result = $("#verifyResult");
      const headline = input.value.trim();
      if (!headline) return;
      button.disabled = true;
      button.textContent = "Analisando...";
      result.hidden = true;
      window.setTimeout(() => {
        const text = headline.toLowerCase();
        const indicators = [];
        let score = 10;
        if (/urgente|breaking|exclusivo|revelado/i.test(text)) { indicators.push("Linguagem de urgência artificial"); score += 20; }
        if (/!{2,}|\?{2,}|[A-Z]{4,}/.test(headline)) { indicators.push("Uso excessivo de maiúsculas ou pontuação"); score += 15; }
        if (/cura|milagre|comprovado|cientistas descobriram/i.test(text)) { indicators.push("Afirmações médicas sem fonte"); score += 25; }
        if (/governo esconde|media esconde|elite esconde/i.test(text)) { indicators.push("Narrativa de conspiração"); score += 30; }
        if (/compartilhe|passe adiante|todo mundo precisa saber/i.test(text)) { indicators.push("Apelo ao compartilhamento emocional"); score += 10; }
        score = Math.min(score, 95);
        const verdict = score >= 60 ? "Alta probabilidade de desinformação" : score >= 30 ? "Conteúdo suspeito" : "Baixo risco";
        const color = score >= 60 ? "#ff4757" : score >= 30 ? "#f59e0b" : "#2ed573";
        result.style.borderLeftColor = color;
        result.innerHTML = `<h3>${verdict}</h3><p><strong>Índice de sinais detectados: ${score}/100</strong></p>${indicators.length ? `<p>Sinais identificados:</p><ul>${indicators.map(item => `<li>${item}</li>`).join("")}</ul>` : "<p>Nenhum dos padrões avaliados foi identificado nesta frase.</p>"}<small>Esta ferramenta é educativa. Ela identifica padrões textuais e não verifica fontes, fatos ou a veracidade da notícia.</small>`;
        result.hidden = false;
        button.disabled = false;
        button.textContent = "Analisar novamente →";
      }, 650);
    });
  }

  // Simulador temático, compartilhado entre a página inicial e o quiz.
  const simulator = $("#simulatorResult");
  if (simulator && window.simulatorData) {
    $$("[data-topic]").forEach(button => button.addEventListener("click", () => {
      const topic = button.dataset.topic;
      const data = window.simulatorData[topic];
      $$("[data-topic]").forEach(item => item.classList.toggle("active", item.dataset.topic === topic));
      simulator.innerHTML = `<h3>“${data.headline}”</h3><div class="simulator-columns"><div><h4>Técnicas de manipulação usadas:</h4><ul>${data.techniques.map(item => `<li>${item}</li>`).join("")}</ul></div><div><h4>Emoção alvo:</h4><span class="emotion-tag">${data.emotion}</span><h4 style="margin-top:1.4rem">Como se proteger:</h4><p>${data.protection}</p></div></div>`;
      simulator.hidden = false;
    }));
  }

  // Quiz com perguntas, feedback, pontuação e reinício.
  function startQuiz(container, questions, pointsPerQuestion) {
    if (!container || !questions?.length) return;
    let current = 0;
    let score = 0;
    let answered = false;
    const render = () => {
      const question = questions[current];
      container.innerHTML = `<div class="quiz-progress">${questions.map((_, index) => `<span class="${index <= current ? "done" : ""}"></span>`).join("")}</div><p class="muted-copy">PERGUNTA ${String(current + 1).padStart(2, "0")} / ${questions.length}</p><h3 class="quiz-question">“${question.headline}”</h3><div class="answer-buttons"><button type="button" data-answer="VERDADEIRA">VERDADEIRA</button><button type="button" data-answer="FALSA">FALSA</button></div><div id="quizFeedback"></div>`;
      $$("[data-answer]", container).forEach(button => button.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const correct = button.dataset.answer === question.answer;
        if (correct) score += pointsPerQuestion;
        $$("[data-answer]", container).forEach(option => {
          option.disabled = true;
          if (option.dataset.answer === question.answer) option.classList.add("correct");
          else if (option === button) option.classList.add("wrong");
        });
        const feedback = $("#quizFeedback", container);
        feedback.innerHTML = `<div class="answer-feedback"><h4 style="color:${correct ? "#2ed573" : "#ff6975"}">${correct ? "Correto!" : "Incorreto!"}</h4><p>${question.explanation}</p><button type="button" id="nextQuestion">${current < questions.length - 1 ? "Próxima pergunta" : "Ver resultado"}</button></div>`;
        $("#nextQuestion", container).addEventListener("click", () => {
          if (current < questions.length - 1) { current++; answered = false; render(); }
          else showResult();
        });
      }));
    };
    const showResult = () => {
      const max = questions.length * pointsPerQuestion;
      const normalized = Math.round(score / max * 10);
      let title, message;
      if (normalized >= 9) { title = "Detector de Fake News"; message = "Parabéns! Você tem excelente senso crítico contra fake news."; }
      else if (normalized >= 7) { title = "Vigilante Digital"; message = "Bom resultado! Continue desenvolvendo seu senso crítico."; }
      else if (normalized >= 5) { title = "Em Desenvolvimento"; message = "Resultado mediano. Vale treinar mais sua capacidade de checagem."; }
      else { title = "Vulnerável à Desinformação"; message = "Atenção! Continue estudando e desenvolvendo seu senso crítico."; }
      container.innerHTML = `<div class="quiz-result-score">${normalized}/10</div><h3>${title}</h3><p class="muted-copy">${message}</p><div class="button-row" style="justify-content:center"><button class="quiz-next" id="restartQuiz" type="button">Tentar novamente</button><a class="button button-outline" href="./ebook.html">Ler o e-book</a></div>`;
      $("#restartQuiz", container).addEventListener("click", () => { current = 0; score = 0; answered = false; render(); });
    };
    render();
  }

  if (window.quizQuestions) {
    const homeQuiz = $("#homeQuiz");
    if (homeQuiz) startQuiz(homeQuiz, window.quizQuestions.slice(0, 5), 2);
    const fullQuiz = $("#fullQuiz");
    if (fullQuiz) startQuiz(fullQuiz, window.quizQuestions, 1);
  }

  // Leitor do e-book: capítulos, estatísticas, lições e navegação.
  const chapterList = $("#chapterList");
  const chapterContent = $("#chapterContent");
  if (chapterList && chapterContent && window.chapters?.length) {
    const chapters = window.chapters;
    let active = 0;
    const renderChapter = () => {
      const chapter = chapters[active];
      document.documentElement.style.setProperty("--chapter-color", chapter.color);
      chapterList.innerHTML = chapters.map((item, index) => `<button class="chapter-link ${index === active ? "active" : ""}" type="button" data-chapter="${index}" style="--chapter-color:${item.color}"><small>${item.num} · ${item.year}</small><span>${item.title}</span></button>`).join("");
      $$("[data-chapter]", chapterList).forEach(button => button.addEventListener("click", () => { active = Number(button.dataset.chapter); renderChapter(); }));
      chapterContent.innerHTML = `<div class="chapter-meta"><span class="chapter-category" style="--chapter-color:${chapter.color}">${chapter.category}</span><span class="chapter-year">${chapter.year}</span></div><p class="section-kicker" style="color:${chapter.color}">CASO ${chapter.num}</p><h1>${chapter.title}</h1><p class="chapter-summary">${chapter.summary}</p><div class="chapter-stats">${chapter.stats.map(stat => `<div class="chapter-stat" style="--chapter-color:${chapter.color}"><strong>${stat.num}</strong><span>${stat.label}</span></div>`).join("")}</div><div class="chapter-paragraphs">${chapter.content.map(paragraph => `<p>${paragraph}</p>`).join("")}</div><div class="lesson-box" style="--chapter-color:${chapter.color}"><small>LIÇÃO PRINCIPAL</small><p>${chapter.lesson}</p></div><div class="chapter-navigation"><button type="button" id="previousChapter" ${active === 0 ? "disabled" : ""}>← ${active > 0 ? chapters[active - 1].title : "Início"}</button><button type="button" id="nextChapter" ${active === chapters.length - 1 ? "disabled" : ""}>${active < chapters.length - 1 ? chapters[active + 1].title : "Fim"} →</button></div><div class="chapter-dots">${chapters.map((_, index) => `<button type="button" data-dot="${index}" class="${index === active ? "active" : ""}" aria-label="Ir para o capítulo ${index + 1}"></button>`).join("")}</div><p class="chapter-count">${active + 1} de ${chapters.length} casos</p>`;
      $("#previousChapter", chapterContent)?.addEventListener("click", () => { active--; renderChapter(); window.scrollTo({top:0,behavior:"smooth"}); });
      $("#nextChapter", chapterContent)?.addEventListener("click", () => { active++; renderChapter(); window.scrollTo({top:0,behavior:"smooth"}); });
      $$("[data-dot]", chapterContent).forEach(button => button.addEventListener("click", () => { active = Number(button.dataset.dot); renderChapter(); }));
    };
    renderChapter();
  }

  // Registra o cache offline somente em hospedagem HTTP/HTTPS.
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(error => console.warn("Não foi possível registrar o modo offline:", error)));
  }
})();
