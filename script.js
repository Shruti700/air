const $ = (id) => document.getElementById(id),
  output = $("output"),
  input = $("commandInput"),
  form = $("commandForm");
const prompt = '<span class="prompt">vaibhav@birthday:~$</span>';
const supported = [
  "show-bugs",
  "list-features",
  "show-logs",
  "cat README.md",
  "sudo unlock-gift",
];
const menu =
  '<div class="result welcome"><p class="success">✓ BIRTHDAY INSTANCE INITIALIZED</p><p>Welcome to your personal build. Available commands:</p><ul class="command-list"><li>show-bugs</li><li>list-features</li><li>show-logs</li><li>cat README.md</li><li>sudo unlock-gift</li></ul><p class="dim">Type a command and press Enter.</p></div>';
const sections = {
  "show-bugs":
    '<div class="result"><p class="success">DIAGNOSTIC REPORT / 4 ITEMS FOUND</p><div class="report"><p><b>ERR_001</b> Chews food 36 times, not per bite - PER MEAL </p><p><b>ERR_002</b> Permanent bollywood obsession</p><p><b>ERR_003</b> Rare ability to roast himself before anyone gets the chance.</p><p><b>WARN_365</b> Too memorable to ever be replaced.</p></div></div>',
  "list-features":
    '<div class="result"><p class="success">FEATURE LIST / ALL SYSTEMS NOMINAL</p><div class="report"><p><b>01 / PREMIUM HUMOR MODE</b> Walks into a room and changes the whole atmosphere.</p><p><b>02 / FOODIE.EXE</b> The never ending love for kabab paratha.</p><p><b>03 / THE PART-TIME SHAYAR</b> Occasionally produced, BUT worth collecting</p><p><b>04 / REAL-LIFE SUPPORT</b> Mostly available at 1 AM </p></div></div>',
  "show-logs":
    '<div class="result"><p class="success">ARCHIVE.LOG / 5 RECORDS FOUND</p><div class="report logs-cli"><p><b>[2017] THE FIRST LAUGH</b> That exact moment we knew this would be a very good kind of friendship.</p><p><b>[2018] THE MORNING WALKS</b> Somehow a core memory.</p><p><b>[2020] THE ORDINARY DAYS</b> The tiny messages, late night calls, and nonsense that made the days better.</p><p><b>[2024] THE FIRST TIMES FOR MANY THINGS</b> Some exciting developments and new discoveries. And the first job.</p><p><b>[2026] THE BIG BOLD DREAMS</b> Watching you grow into your dreams.</p></div></div>',
  "cat readme.md":
    '<div class="result readme-cli"><p class="success">README.MD</p><h2>Happy birthday,<br><em>you wonderful human.</em></h2><p>I hope this year gives you room for the big life you’re building, the soft things you deserve, and plenty of reasons to laugh until it hurts.</p><p>Thank you for being exactly who you are. The world and my world is 100% better with you.</p><p>with a lot of love,<br>your favorite girlfriend <b>♥</b></p></div>',
};
function print(command, html) {
  output.insertAdjacentHTML(
    "beforeend",
    '<div class="issued">' +
      prompt +
      " <span>" +
      command +
      "</span></div>" +
      html,
  );
  input.value = "";
  output.scrollIntoView({ behavior: "smooth", block: "end" });
}
let initializing = false;
function bootSequence(raw) {
  if (initializing) return;
  initializing = true;
  print(raw, '<div class="result boot-sequence" id="bootSequence"></div>');
  const lines = [
    "[  OK  ] checking authorized user... <b>verified</b>",
    "[  OK  ] loading birthday data... <b>complete</b>",
    "[  OK  ] running friendship verification... <b>passed</b>",
    '<span class="detected">✦ BIRTHDAY DETECTED — celebration mode enabled ✦</span>',
  ];
  let i = 0;
  const run = () => {
    const box = $("bootSequence");
    box.insertAdjacentHTML("beforeend", "<p>" + lines[i] + "</p>");
    output.scrollIntoView({ behavior: "smooth", block: "end" });
    i++;
    if (i < lines.length) setTimeout(run, 620);
    else
      setTimeout(() => {
        box.insertAdjacentHTML("beforeend", menu);
        initializing = false;
        input.focus();
      }, 650);
  };
  setTimeout(run, 400);
}
function execute(raw) {
  const command = raw.trim().toLowerCase();
  if (!command) return;
  if (command === "clear") {
    output.innerHTML = "";
    return;
  }
  if (command === "./initialize-birthday") {
    bootSequence(raw);
    return;
  }
  if (command === "sudo unlock-gift") {
    print(
      raw,
      '<div class="result success">ACCESS GRANTED. Opening gift module...</div>',
    );
    setTimeout(() => $("gift").classList.remove("hide"), 550);
    return;
  }
  if (sections[command]) {
    print(raw, sections[command]);
    return;
  }
  print(
    raw,
    '<div class="result error">command not found: ' +
      raw +
      "<br><span>Try one of the commands listed above.</span></div>",
  );
}
form.insertAdjacentHTML(
  "afterend",
  '<div class="suggestions" id="suggestions"></div>',
);
const suggestions = $("suggestions");
let selected = -1;
function matches() {
  const typed = input.value.toLowerCase();
  return supported.filter((command) => command.startsWith(typed));
}
function paint() {
  const list = matches();
  suggestions.innerHTML = list
    .map(
      (command, index) =>
        '<button type="button" class="' +
        (index === selected ? "selected" : "") +
        '" data-command="' +
        command +
        '">' +
        command +
        "</button>",
    )
    .join("");
}
function suggest() {
  selected = -1;
  paint();
}
function complete() {
  const list = matches();
  if (list[selected]) {
    input.value = list[selected];
    selected = -1;
    paint();
  }
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  execute(input.value);
  suggest();
});
input.addEventListener("input", suggest);
input.addEventListener("keydown", (e) => {
  const list = matches();
  if (e.key === "ArrowDown" && list.length) {
    e.preventDefault();
    selected = (selected + 1) % list.length;
    paint();
  } else if (e.key === "ArrowUp" && list.length) {
    e.preventDefault();
    selected = (selected - 1 + list.length) % list.length;
    paint();
  } else if (e.key === "Tab" && list.length) {
    e.preventDefault();
    if (selected < 0) selected = 0;
    complete();
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (selected >= 0) complete();
    execute(input.value);
    suggest();
  }
});
suggestions.addEventListener("click", (e) => {
  const command = e.target.dataset.command;
  if (command) {
    input.value = command;
    input.focus();
    suggest();
  }
});
document.addEventListener("click", (e) => {
  if (!suggestions.contains(e.target)) input.focus();
});
$("close").onclick = () => $("gift").classList.add("hide");
$("gift").onclick = (e) => {
  if (e.target === $("gift")) $("gift").classList.add("hide");
};
function time() {
  $("clock").textContent =
    "LOCAL TIME — " +
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
}
time();
setInterval(time, 1000);
