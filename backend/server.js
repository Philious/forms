const express = require("express");
const uuid = require("uuid");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Create user # { user: string, password: string }: User
app.post("/users", (req, res) => {
  const { email, password } = req.body;
  const emails = users.map((u) => u.email);

  if (!email || !password) {
    return res.status(400).send("Details missing");
  } else if (emails.includes(email)) {
    return res.status(409).send("Email already exsists");
  }

  const newUser = {
    uuid: uuid.v4(),
    createdAt: new Date().toISOString(),
    email,
    password,
  };

  users.push(newUser);

  res.status(200).json(newUser);
});

// Login # { user: string, password: string }: string
app.get("/users/login/:email/:password", (req, res) => {
  const { email, password } = req.params;

  if (!email || !password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const userIndex = users.findIndex(
    (u) => u.email === email && u.password === password
  );

  if (userIndex >= 0) {
    const token = uuid.v4();
    users[userIndex].token = token;
    res.status(200).json(token);
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Logout # { token: string }: boolean
app.delete("/users/logout/:token", (req, res) => {
  console.log("logout");
  const token = req.params.token;
  const userIndex = users.findIndex((u) => u.token === token);

  if (userIndex < 0) {
    return errorResponse(res, 500);
  }

  users[userIndex].token = null;

  res.status(200).json(true);
  res.clearCookie("notecookie");
});

/// Check token # { token: string }: boolean
app.get("/users/check/:token", (req, res) => {
  console.log("check token");
  const token = req.params.token;
  const user = users.find((u) => u.token === token);

  res.status(200).json(!!user);
});

// Get all notes # { token: string }: Notes[]
app.get("/notes/:token", (req, res) => {
  console.log("get all notes");
  const token = req.params.token;
  const userIndex = users.findIndex((u) => u.token === token);

  if (userIndex < 0) {
    return res.status(404).json({ error: "No user with that token" });
  }

  const userId = users[userIndex]?.uuid;
  const userNotes = notes[userId];

  res.status(200).json(userNotes);
});

// Get note # { token: string, noteId: string }: Note
app.get("/notes/:token/:noteId", (req, res) => {
  console.log("get note");
  const { token, noteId } = req.params;
  const userIndex = users.findIndex((u) => u.token === token);

  if (userIndex < 0) {
    return res.status(404).json({ error: "No user with that token" });
  }

  const userId = users[userIndex]?.uuid;
  const userNotes = notes[userId];
  const note = userNotes.find((n) => n.id === noteId);

  res.status(200).json(note);
});

// Create a new note # { param: { token: string }, body: { note: Note } }: Note
app.post("/notes/:token", (req, res) => {
  console.log("new note");
  const token = req.params.token;
  const note = req.body;
  const userIndex = users.findIndex((u) => u.token === token);

  if (userIndex < 0) {
    return res.status(404).json({ error: "No user with that token" });
  }

  const userId = users[userIndex].uuid;
  const date = new Date();
  const newNote = {
    ...note,
    createdAt: date,
    updatedAt: date,
    id: uuid.v4(),
  };

  notes[userId].push(newNote);

  res.status(200).json(newNote);
});

// Update note # { param: token, body: Partial<Note & { noteId: string}> }: void
app.put("/notes/:token/", (req, res) => {
  console.log("update note");
  const token = req.params.token;
  const note = req.body;

  const userIndex = users.findIndex((u) => u.token === token);

  if (userIndex < 0) {
    return res.status(404).json({ error: "No user with that token" });
  }

  const userId = users[userIndex].uuid;
  const noteIndex = notes[userId].findIndex((i) => i.id === note.id);

  if (noteIndex < 0) {
    return res.status(404).json({ error: "Note doesn't exist" });
  }

  const prevNote = notes[userId][noteIndex];
  const currentNote = {
    ...prevNote,
    ...note,
    updatedAt: new Date().toISOString(),
  };
  notes[userId][noteIndex] = currentNote;

  return res.status(200).json();
});

// Delete an existing note # { param: {id string } }: void
app.delete("/notes/:token/:noteId", (req, res) => {
  const { token, noteId } = req.params;
  const userIndex = users.findIndex((u) => u.token === token);

  if (userIndex < 0) {
    return res.status(404).json({ error: "No user with that token" });
  }

  const userId = users[userIndex].uuid;
  const noteIndex = notes[userId].findIndex((n) => n.id === noteId);

  if (noteIndex < 0) {
    res.status(404).json({ error: "Note doesn't exist" });
  } else {
    notes[userId].splice(noteIndex, 1);
    res.status(200).json();
  }
});

// Seeded startdata
// notes # { id: string, title: string, content: string, catalog: string, tags: string[], createdAt: string, updatedAt: string }
const notes = {
  "89503dc5-9517-48a2-833f-6bc7c0d32f1b": [
    {
      id: uuid.v4(),
      title: "Montera ner pariserhjulet",
      content:
        "Avsluta sista åkturen kl 22. Säkerställ att alla bultar är ordentligt förvarade, och märk sektionerna enligt instruktionerna.",
      catalog: "Logistik",
      tags: ["pariserhjul", "demontering", "säkerhet"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuid.v4(),
      title: "Matvarulista för nästa stopp",
      content:
        "Behöver korv, bröd, senap, ketchup, socker till sockervaddsmaskinen och extra smör för popcornmaskinen.",
      catalog: "Förnödenheter",
      tags: ["mat", "förnödenheter", "sockervadd"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuid.v4(),
      title: "Planera tivolins layout i Västerås",
      content:
        "Följ den nya planen för större säkerhetsavstånd. Placera radiobilarna nära ingången och skjutbanan längst bort.",
      catalog: "Planering",
      tags: ["layout", "säkerhet", "platsplanering"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuid.v4(),
      title: "Reparation av berg-och-dalbanan",
      content:
        "Slitage på spåren märkt på sista sektionen. Kontrollera alla säkerhetsfästen, ta fram reservdelar om nödvändigt.",
      catalog: "Underhåll",
      tags: ["berg-och-dalbana", "reparation", "säkerhet"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuid.v4(),
      title: "Kvällsshowen – förberedelser",
      content:
        "Dubbelkolla att musiken är klar och högtalarna fungerar. Kontrollera elden till eldslukaren och informera publik om säkerhetsavstånd.",
      catalog: "Show",
      tags: ["show", "förberedelser", "eldslukare"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

// Users { uuid: string, email: string, password: string, createdAt: string, notes: Note[] }
const users = [
  {
    uuid: "89503dc5-9517-48a2-833f-6bc7c0d32f1b",
    email: "conny@carneval.com",
    password: "12345†",
    createdAt: new Date().toISOString(),
    token: null,
  },
];
