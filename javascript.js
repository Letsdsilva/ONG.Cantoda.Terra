// ONG Canto da Terra — interações em JavaScript puro

const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) {
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-label", "Abrir menu");
    }
  });
});

// Favoritos demonstrativos nos cards de adoção.
document.querySelectorAll(".favorite-button").forEach((button) => {
  button.addEventListener("click", () => {
    const isFavorite = button.classList.toggle("is-favorite");
    button.textContent = isFavorite ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(isFavorite));
  });
});


// Validação da interface do formulário de contato.
const contactForm = document.querySelector("#contactForm");
const toast = document.querySelector("#toast");
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 4500);
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const name = document.querySelector("#name").value.trim();
  showToast(`Obrigado, ${name}! Esta é uma demonstração: a mensagem não foi enviada.`);
  contactForm.reset();
  if (reverseCepMode) setReverseCepMode(false);
});


// Formulários separados: consulta, castração e interesse em adoção.
document.querySelectorAll(".appointment-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const person = form.querySelector('input[name="nome"]')?.value.trim() || "Olá";
    let message = "Seu formulário foi preenchido com sucesso.";
    if (form.id === "form-consulta") message = `Obrigado, ${person}! Sua solicitação de consulta foi preenchida.`;
    if (form.id === "form-castracao") message = `Obrigado, ${person}! Sua solicitação de castração foi preenchida.`;
    if (form.id === "form-adocao") message = `Obrigado, ${person}! Seu interesse foi preenchido nesta demonstração, sem envio de dados.`;
    showToast(`${message} Nenhum dado foi enviado.`);
    form.reset();
  });
});

// Impede a seleção de datas passadas nos formulários de agendamento.
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
document.querySelectorAll('input[type="date"]').forEach((dateInput) => {
  dateInput.min = localToday;
});


// Exibe somente o formulário escolhido; os demais permanecem recolhidos.
document.querySelectorAll("[data-open-form]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const targetId = trigger.dataset.openForm;
    const target = document.getElementById(targetId);
    if (!target) return;

    document.querySelectorAll(".appointment-form, #contactForm").forEach((form) => {
      form.hidden = true;
    });

    target.hidden = false;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    const firstField = target.querySelector("input, select, textarea");
    firstField?.focus({ preventScroll: true });
  });
});

document.querySelectorAll("[data-close-form]").forEach((button) => {
  button.addEventListener("click", () => {
    const form = button.closest("form");
    if (form) {
      form.hidden = true;
      const section = form.closest("section");
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


// Ao escolher um animal, abre o formulário de adoção já preenchido com seu nome.
document.querySelectorAll(".adoption-interest").forEach((button) => {
  button.addEventListener("click", () => {
    const form = document.querySelector("#form-adocao");
    const animalSelect = document.querySelector("#adocaoAnimal");
    const animalName = button.dataset.animal;
    if (!form || !animalSelect) return;

    document.querySelectorAll(".appointment-form, #contactForm").forEach((item) => {
      item.hidden = true;
    });

    animalSelect.value = animalName;
    const intro = document.querySelector("#adoptionFormIntro");
    if (intro) intro.textContent = `Você demonstrou interesse em adotar ${animalName}. Preencha seus dados para continuar.`;
    form.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    form.querySelector('input[name="nome"]')?.focus({ preventScroll: true });
  });
});

// Consulta pública de CEP (ViaCEP): busca direta por CEP e busca reversa por Rua/Cidade/UF.
const cepInput = document.querySelector('#cep');
const buscarCepButton = document.querySelector('#buscarCep');
const naoSeiCepButton = document.querySelector('#naoSeiCep');
const cepReverseBox = document.querySelector('#cepReverseBox');
const buscaUfInput = document.querySelector('#buscaUf');
const buscaCidadeInput = document.querySelector('#buscaCidade');
const buscaRuaInput = document.querySelector('#buscaRua');
const buscarPorRuaButton = document.querySelector('#buscarPorRua');
const cepResultados = document.querySelector('#cepResultados');
const cepHint = document.querySelector('#cepHint');
const addressFields = ['#logradouro', '#bairro', '#cidade'].map((sel) => document.querySelector(sel));
let reverseCepMode = false;

function fillAddressFields(data) {
  document.querySelector('#logradouro').value = data.logradouro || '';
  document.querySelector('#bairro').value = data.bairro || '';
  document.querySelector('#cidade').value = [data.localidade, data.uf].filter(Boolean).join(' - ');
  if (data.cep && cepInput) {
    cepInput.value = data.cep;
  }
}

function setReverseCepMode(enabled) {
  reverseCepMode = enabled;
  if (!cepReverseBox || !naoSeiCepButton) return;
  cepReverseBox.hidden = !enabled;

  if (enabled) {
    naoSeiCepButton.textContent = 'Fechar busca por rua';
    if (cepHint) cepHint.textContent = 'Digite o nome da rua e clique em "Buscar CEP" para escolher entre as opções encontradas.';
    buscaRuaInput?.focus();
  } else {
    naoSeiCepButton.textContent = 'Não sei meu CEP';
    if (cepHint) cepHint.textContent = 'Informe o CEP para localizar sua região automaticamente (adoção, resgate ou ações locais).';
    if (cepResultados) {
      cepResultados.hidden = true;
      cepResultados.innerHTML = '';
    }
  }
}

naoSeiCepButton?.addEventListener('click', () => {
  setReverseCepMode(!reverseCepMode);
});

buscarCepButton?.addEventListener('click', async () => {
  const cep = (cepInput?.value || '').replace(/\D/g, '');
  if (!/^\d{8}$/.test(cep)) {
    showToast('Informe um CEP válido com 8 números.');
    cepInput?.focus();
    return;
  }

  buscarCepButton.disabled = true;
  buscarCepButton.textContent = 'Consultando...';
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) throw new Error('Falha na consulta');
    const data = await response.json();
    if (data.erro) throw new Error('CEP não encontrado');
    fillAddressFields(data);
    showToast('Endereço localizado pelo CEP.');
  } catch (error) {
    showToast(error.message === 'CEP não encontrado' ? error.message : 'Não foi possível consultar o CEP. Tente novamente.');
  } finally {
    buscarCepButton.disabled = false;
    buscarCepButton.textContent = 'Consultar CEP';
  }
});

buscarPorRuaButton?.addEventListener('click', async () => {
  const uf = (buscaUfInput?.value || '').trim().toUpperCase();
  const cidade = (buscaCidadeInput?.value || '').trim();
  const rua = (buscaRuaInput?.value || '').trim();

  if (!/^[A-Z]{2}$/.test(uf) || cidade.length < 3 || rua.length < 3) {
    showToast('Preencha UF (2 letras), cidade e pelo menos 3 letras do nome da rua.');
    return;
  }

  buscarPorRuaButton.disabled = true;
  buscarPorRuaButton.textContent = 'Buscando...';
  try {
    const url = `https://viacep.com.br/ws/${encodeURIComponent(uf)}/${encodeURIComponent(cidade)}/${encodeURIComponent(rua)}/json/`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha na busca');
    const lista = await response.json();

    if (!Array.isArray(lista) || lista.length === 0) {
      cepResultados.hidden = false;
      cepResultados.innerHTML = '<p class="cep-empty">Nenhum CEP encontrado para essa rua. Confira a ortografia.</p>';
      return;
    }

    const opcoes = lista.slice(0, 8);
    cepResultados.hidden = false;
    cepResultados.innerHTML = `
      <span class="cep-results-title">Selecione o CEP correspondente (${opcoes.length} ${opcoes.length === 1 ? 'opção' : 'opções'}):</span>
      <div class="cep-options-list">
        ${opcoes.map((item, idx) => `
          <button type="button" class="cep-option-btn" data-cep-idx="${idx}">
            <strong>${item.cep}</strong> — ${item.logradouro || rua}${item.complemento ? ` (${item.complemento})` : ''} · ${item.bairro || 'Centro'}, ${item.localidade}-${item.uf}
          </button>
        `).join('')}
      </div>
    `;

    cepResultados.querySelectorAll('.cep-option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = opcoes[Number(btn.dataset.cepIdx)];
        if (!chosen) return;
        fillAddressFields(chosen);
        setReverseCepMode(false);
        showToast(`CEP ${chosen.cep} selecionado e endereço preenchido!`);
      });
    });
  } catch (error) {
    showToast('Não foi possível buscar os CEPs pelo nome da rua.');
  } finally {
    buscarPorRuaButton.disabled = false;
    buscarPorRuaButton.textContent = 'Buscar CEP';
  }
});

cepInput?.addEventListener('input', () => {
  const digits = cepInput.value.replace(/\D/g, '').slice(0, 8);
  cepInput.value = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
});


// Filtro de animais por espécie.
document.querySelectorAll(".animal-filter button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".animal-filter button").forEach((b) => b.classList.toggle("is-active", b === btn));
    document.querySelectorAll("#animalGrid .animal-card").forEach((card) => {
      card.hidden = btn.dataset.filter !== "all" && card.dataset.species !== btn.dataset.filter;
    });
  });
});

// IoT (simulado): pontos fictícios de água e ração. No Tinkercad, potenciômetros simulam os sensores.
const pontosFicticios = [
  { nome: "Ponto 1 · Entrada do Parque Peruche", local: "Local fictício" },
  { nome: "Ponto 2 · Praça Canto Verde", local: "Local fictício" },
  { nome: "Ponto 3 · Rua Valdemar Martins, em frente à sede", local: "Local fictício" },
  { nome: "Ponto 4 · Passarela do Córrego", local: "Local fictício" },
];
const pontosLista = document.querySelector("#pontosLista");
if (pontosLista) {
  pontosLista.innerHTML = pontosFicticios.map((p, i) => `
    <div class="ponto" data-ponto="${i}">
      <h4>${p.nome}</h4><small>${p.local}</small>
      <div class="meter"><span>Água</span><div><i class="bar-agua"></i></div><b class="val-agua">--%</b></div>
      <div class="meter"><span>Ração</span><div><i class="bar-racao"></i></div><b class="val-racao">--%</b></div>
      <p class="iot-alert">Aguardando leitura...</p>
    </div>`).join("");
}
function lerSensores() {
  document.querySelectorAll(".ponto").forEach((ponto) => {
    const agua = Math.round(Math.random() * 100);
    const racao = Math.round(Math.random() * 100);
    [["agua", agua], ["racao", racao]].forEach(([id, v]) => {
      const bar = ponto.querySelector(`.bar-${id}`);
      bar.style.width = `${v}%`;
      bar.style.background = v <= 20 ? "#b5482f" : "";
      ponto.querySelector(`.val-${id}`).textContent = `${v}%`;
    });
    ponto.querySelector(".iot-alert").textContent =
      agua <= 20 && racao <= 20 ? "ALERTA: água e comida vazios!" :
      agua <= 20 ? "ALERTA: bebedouro vazio! Repor água." :
      racao <= 20 ? "ALERTA: comedouro vazio! Repor comida." : "Tudo normal!";
  });
}
document.querySelector("#iotLer")?.addEventListener("click", lerSensores);
lerSensores();

// API Open-Meteo (sem chave): clima atual na Zona Norte de São Paulo.
(async () => {
  const temp = document.querySelector("#climaTemp");
  const info = document.querySelector("#climaInfo");
  if (!temp) return;
  try {
    const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-23.49&longitude=-46.69&current=temperature_2m,precipitation,wind_speed_10m&timezone=America%2FSao_Paulo");
    if (!r.ok) throw new Error();
    const { current } = await r.json();
    temp.textContent = `${Math.round(current.temperature_2m)} °C`;
    info.textContent = `Chuva: ${current.precipitation} mm · Vento: ${current.wind_speed_10m} km/h`;
  } catch {
    temp.textContent = "--";
    info.textContent = "Não foi possível consultar o clima agora.";
  }
})();

// Nomes precisam ter mais de 2 caracteres (sem contar espaços nas pontas).
document.querySelectorAll('#name, input[name="nome"], input[name="animal"]').forEach((input) => {
  const check = () => input.setCustomValidity(input.value.trim().length > 2 ? "" : "Digite pelo menos 3 caracteres.");
  input.addEventListener("input", check);
  check();
});

// Adoção: escolha cachorro ou gato e veja os animais em um carrossel de fotos.
const carousel = document.querySelector("#carousel");
const track = document.querySelector("#carouselTrack");
document.querySelectorAll(".choice").forEach((choice) => {
  choice.addEventListener("click", () => {
    const species = choice.dataset.species;
    track.innerHTML = "";
    document.querySelectorAll(`#animalGrid .animal-card[data-species="${species}"]`).forEach((card) => {
      const clone = card.cloneNode(true);
      clone.querySelectorAll("img").forEach((img) => { img.loading = "eager"; });
      track.appendChild(clone);
    });
    document.querySelector("#carouselTitle").textContent = species === "Cão" ? "Cães para adoção" : "Gatos para adoção";
    carousel.hidden = false;
    track.scrollLeft = 0;
    carousel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
document.querySelector("#carouselClose")?.addEventListener("click", () => {
  carousel.hidden = true;
  document.querySelector(".adopt-choice")?.scrollIntoView({ behavior: "smooth", block: "center" });
});
const passo = () => (track.querySelector(".animal-card")?.offsetWidth || 300) + 20;
document.querySelector("#carPrev")?.addEventListener("click", () => track.scrollBy({ left: -passo() }));
document.querySelector("#carNext")?.addEventListener("click", () => track.scrollBy({ left: passo() }));
// Botão "Tenho interesse" dentro do carrossel aciona o botão original do animal.
track?.addEventListener("click", (event) => {
  const btn = event.target.closest(".adoption-interest");
  if (!btn) return;
  document.querySelector(`#animalGrid .adoption-interest[data-animal="${btn.dataset.animal}"]`)?.click();
});
