import translations from '../src/assets/translations.json';
import express, { Request, Response, Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Language } from '../src/helpers/enum';

type LanguageGroup = Record<Language, string>
type KeyEntry = Map<string, LanguageGroup>
type Translations = Record<string, KeyEntry>

const uuid = require("uuid");
const app = express();
const port = 3000;

const defaultTranslation = new Map();
Object.entries(translations).forEach(([key, value]) => defaultTranslation.set(key, value))
const trans: Translations = {
  default: defaultTranslation
}

app.use(
  cors({
    origin: "http://localhost:4300",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// Get all questions Record<string, Record<>>
app.get("/root/:root", (req: Request, res: Response) => {
  console.log("get questions");
  const { root } = req.params;
  if (root) {
    res.status(200).json(trans[root]);
  } else {
    // trans[root] = {};
  }

});


//TranslationSet
app.get("/set/:translation", (req: Request, res: Response) => {
  console.log("get questions");
  const { root } = req.params;
  if (root) {
    res.status(200).json(trans[root]);
  } else {
    // trans[root] = {};
  }

});

app.post("/set/:translation/:lang/:entry", (req, res) => {
  console.log("new note");
})

app.put("/set/:translation/:lang/:entry", (req, res) => {

  return res.status(200).json();
});

app.delete("/set/:translation", (req, res) => {
  const { translation } = req.params;
  const error = false;

  if (error) {
    res.status(404).json({ error: "Note doesn't exist" });
  } else {

    res.status(200).json();
  }
})


//TranslationEntry
app.post("/translation/:lang/:entry", (req, res) => {
  console.log("new note");
})

app.put("/translation/:lang/:entry", (req, res) => {

  return res.status(200).json();
});



app.put("/translation/:lang/:entry", (req, res) => {

  return res.status(200).json();
});

app.delete("/translation/:lang/:entry", (req, res) => {
  const { lang, entry } = req.params;
  const error = false;

  if (error) {
    res.status(404).json({ error: "Note doesn't exist" });
  } else {

    res.status(200).json();
  }
})
