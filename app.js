let words = JSON.parse(localStorage.getItem("words")) || [];
let quizList = [];
let quizIndex = 0;

function save() {
  localStorage.setItem("words", JSON.stringify(words));
}

function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  renderWords();
  renderEdit();
}

// ---------- ADD ----------
function addWord() {
  const word = document.getElementById("word").value;
  const meaning = document.getElementById("meaning").value;
  const description = document.getElementById("description").value;

  if (!word || !meaning) return;

  words.push({
    id: Date.now(),
    word,
    meaning,
    description,
    selected: false
  });

  save();
  alert("Kelime eklendi");
  renderWords();
}

function addQuick() {
  const text = document.getElementById("quickAdd").value;
  const lines = text.split("\n").map(l => l.trim()).filter(l => l);

  lines.forEach(line => {
    const parts = line.split("|").map(p => p.trim());
    if (parts.length < 3) return;

    words.push({
      id: Date.now() + Math.random(),
      word: parts[0],
      meaning: parts[1],
      description: parts[2],
      selected: false
    });
  });

  save();
  alert(`${lines.length} kelime eklendi`);
  document.getElementById("quickAdd").value = "";
  renderWords();
}
function renderSelected() {
  const selectedDiv = document.getElementById("selectedList");
  const selectedWords = words.filter(w => w.selected);
  selectedDiv.innerHTML = "";

  selectedWords.forEach(w => {
    selectedDiv.innerHTML += `
      <div class="card">
        <strong>${w.word}</strong> - ${w.meaning}
        <button onclick="toggleSelect(${w.id})">Çıkar</button>
      </div>
    `;
  });
}

function renderWords() {
  const list = document.getElementById("wordList");
  const q = document.getElementById("search").value.toLowerCase();
  list.innerHTML = "";

  words.forEach(w => {
    if (!w.word.toLowerCase().includes(q) && !w.meaning.toLowerCase().includes(q)) return;

    list.innerHTML += `
      <div class="card">
        <strong>${w.word}</strong><br>
        ${w.meaning}<br>
        <small>${w.description}</small><br>
        <button onclick="toggleSelect(${w.id})">${w.selected ? "✓ Seçili" : "Seç"}</button>
        <button onclick="deleteWord(${w.id})">Sil</button>
      </div>
    `;
  });

  renderSelected(); // sağ panel
}



function toggleSelect(id) {
  const w = words.find(x => x.id === id);
  w.selected = !w.selected;
  save();
  renderWords();
}

function deleteWord(id) {
  words = words.filter(w => w.id !== id);
  save();
  renderWords();
}

// ---------- EDIT ----------
function renderEdit() {
  const list = document.getElementById("editList");
  const q = document.getElementById("editSearch")?.value.toLowerCase() || "";
  list.innerHTML = "";

  words.forEach(w => {
    if (!w.word.toLowerCase().includes(q) && !w.meaning.toLowerCase().includes(q)) return;

    list.innerHTML += `
      <div class="card">
        <input value="${w.word}" oninput="updateWord(${w.id}, 'word', this.value)">
        <input value="${w.meaning}" oninput="updateWord(${w.id}, 'meaning', this.value)">
        <textarea oninput="updateWord(${w.id}, 'description', this.value)">${w.description}</textarea>
      </div>
    `;
  });
}



function updateWord(id, field, value) {
  const w = words.find(x => x.id === id);
  w[field] = value;
  save();
  renderWords();
}

// ---------- QUIZ ----------
function startQuiz(type) {
  if (type === "first") {
    const x = prompt("Kaç kelime?");
    quizList = words.slice(0, x);
  }
  if (type === "range") {
    const a = prompt("Başlangıç");
    const b = prompt("Bitiş");
    quizList = words.slice(a - 1, b);
  }
  if (type === "selected") {
    quizList = words.filter(w => w.selected);
  }

  quizIndex = 0;
  showQuiz();
}

function showQuiz() {
  if (quizIndex >= quizList.length) {
    document.getElementById("quizBox").innerHTML = "<h3>Bitti 🎉</h3>";
    return;
  }

  const w = quizList[quizIndex];
  document.getElementById("quizBox").innerHTML = `
    <div class="quiz-card">
      <h3>${w.word}</h3>
      <div class="quiz-buttons">
        <button onclick="reveal()">Anlamı Göster</button>
        <button onclick="next()">Atla</button>
      </div>
      <div id="meaningBox" style="margin-top:10px;"></div>
    </div>
  `;
}


function reveal() {
  const w = quizList[quizIndex];
  document.getElementById("meaningBox").innerHTML = `
    <p><strong>${w.meaning}</strong></p>
    <p>${w.description}</p>
  `;
}

function next() {
  quizIndex++;
  showQuiz();
}

renderWords();
renderEdit();
