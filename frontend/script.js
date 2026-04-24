let currentRoom = 1;

function loadRoom() {
  fetch("/question", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ room: currentRoom })
  })
  .then(r => r.json())
  .then(d => {
    document.getElementById("question").innerText = d.data;
  });
}

function submitAnswer() {
  const ans = document.getElementById("answer").value;

  fetch("/check", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ room: currentRoom, answer: ans })
  })
  .then(r => r.json())
  .then(d => {
    if(d.data === "correct") {
      if(currentRoom === 7) {
        document.body.innerHTML = "<h1 style='color:red'>YOU ESCAPED</h1>";
      } else {
        currentRoom++;
        loadRoom();
      }
    } else {
      jumpscare();
    }
  });
}

function getHint() {
  fetch("/hint", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ room: currentRoom })
  })
  .then(r => r.json())
  .then(d => {
    document.getElementById("hintBox").innerText =
      "whisper: " + d.data;
  });
}

function jumpscare() {
  const screen = document.getElementById("jumpscareScreen");
  const audio = document.getElementById("jumpscare");

  // prepare audio first
  audio.pause();
  audio.currentTime = 0;

  // FORCE browser to load audio before showing image
  audio.load();

  // wait until audio is ready
  const start = () => {
    screen.style.display = "flex";

    // small delay ensures perfect sync
    setTimeout(() => {
      audio.play();
    }, 50);
  };

  if (audio.readyState >= 3) {
    start();
  } else {
    audio.addEventListener("canplaythrough", start, { once: true });
  }

  document.body.classList.add("shake");

  setTimeout(() => {
    screen.style.display = "none";
    document.body.classList.remove("shake");
  }, 1200);
}

window.addEventListener("click", () => {
  const bg = document.getElementById("bgMusic");
  bg.muted = false;
  bg.volume = 0.1;
  bg.play();
}, { once: true });

loadRoom();