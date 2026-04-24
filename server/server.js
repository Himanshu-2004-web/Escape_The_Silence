const express = require("express");
const path = require("path");
const { spawn } = require("child_process");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

/* =========================
   QUESTIONS
========================= */

const q = {
  1: "I follow you everywhere but disappear in darkness.",
  2: "What flows but never stops?",
  3: "I am inside every living being.",
  4: "I kill everything but move slowly.",
  5: "I exist when no sound is present.",
  6: "I grow when fear increases.",
  7: "Say the final word to escape."
};

/* =========================
   PATH TO C++ EXECUTABLE
========================= */

const cppPath = path.join(__dirname, "engine.exe");

/* =========================
   QUESTION ROUTE
========================= */

app.post("/question", (req, res) => {
  res.json({ data: q[req.body.room] });
});

/* =========================
   SAFE C++ RUN FUNCTION
========================= */

function runCpp(input, callback) {
  const cpp = spawn(cppPath, [], {
    shell: true
  });

  let output = "";

  cpp.stdin.write(input + "\n");
  cpp.stdin.end();

  cpp.stdout.on("data", (data) => {
    output += data.toString();
  });

  cpp.on("close", () => {
    callback(output.trim());
  });

  cpp.on("error", (err) => {
    console.log("C++ ERROR:", err);
    callback("error");
  });
}

/* =========================
   HINT ROUTE
========================= */

app.post("/hint", (req, res) => {
  runCpp(`hint ${req.body.room}`, (result) => {
    res.json({ data: result });
  });
});

/* =========================
   CHECK ROUTE
========================= */

app.post("/check", (req, res) => {
  runCpp(
    `check ${req.body.room} ${req.body.answer}`,
    (result) => {
      res.json({ data: result });
    }
  );
});

/* =========================
   START SERVER
========================= */

app.listen(3000, () => {
  console.log("🔥 Horror Game Running on http://localhost:3000");
});
