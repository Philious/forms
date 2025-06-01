import cookieSession from 'cookie-session';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
// import { v4 as uuid } from 'uuid';
import { HttpStatusCode, QuestionId, QuestionPayload, Section, SectionPayload } from '@cs-forms/shared';
import {
  addQuestion,
  addSection,
  deleteSection,
  getAllQuestions,
  getAllSections,
  getQuestionPayload,
  getSection,
  updateQuestion,
  updateSection,
} from './store.js';

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.json());

app.use(
  cookieSession({
    name: 'session',
    keys: ['super-secret'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
);

app.get('/api/user', (req, res) => {
  if (req.session && !req.session.user) {
    req.session.user = { id: '123', name: 'Alice' };
    res.json({ status: 'logged in' });
  }

  res.json(req.session?.user);
});

function error(status: HttpStatusCode, msg: string) {
  var err = new Error(msg) as Error & { status: HttpStatusCode };
  err['status'] = status;

  return err;
}

app.get('/api/sections/all', (_: Request, res: Response) => {
  console.log('send sections');
  res.status(200).json(getAllSections());
});

app.get('/api/sections/minimal', (_: Request, res: Response) => {
  console.log('send sections');
  const minimal = getAllSections().map(s => ({ id: s.id, name: s.name }));
  res.status(200).json(minimal);
});

app.get('/api/sections/:id', (req: Request, res: Response, next: NextFunction) => {
  console.log('get section');
  const { id } = req.params;
  const section = getSection(id);

  if (section) res.status(200).json(section);
  else next(error(404, 'Section not found'));
});

app.post('/api/sections/add', (req: Request<SectionPayload>, res: Response, next: NextFunction) => {
  const check = addSection(req.body);
  if (check) res.status(200).json(req.body);
  else next(error(400, 'Bad Request'));
});

app.post('/api/sections/update', (req: Request<Partial<SectionPayload> & { id: string }>, res: Response<Section>, next: NextFunction) => {
  const updatedSection = updateSection(req.body);
  updatedSection ? res.status(200).json(updatedSection) : next(error(400, 'Bad Request'));
});

app.delete('/api/section/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  deleteSection(id);
  res.status(200);
});

/** Questions */
app.get('/api/questions/all', (_: Request, res: Response) => {
  console.log('get all questions');
  res.status(200).json(getAllQuestions());
});

app.get('/api/questions/:id', (req: Request, res: Response<QuestionPayload[]>) => {
  console.log('send questions');
  const { id } = req.params;
  const questionIds = getSection(id)?.questions;
  if (questionIds) {
    const sectionQuestions = questionIds.map(qid => getQuestionPayload(qid as QuestionId)).filter(q => !!q);
    res.status(200).json(sectionQuestions);
  }
});

app.get('/api/questions/:id', (req: Request, res: Response<QuestionPayload>, next: NextFunction) => {
  console.log('get question by id');
  const { id } = req.params;
  const newSet = getQuestionPayload(id);

  if (newSet) res.status(200).json(newSet);
  else next(error(404, 'Question not found'));
});

app.post('/api/questions/batch', (req: Request<QuestionId[]>, res: Response<QuestionPayload[]>, next: NextFunction) => {
  console.log('get collection by id');
  const ids: QuestionId[] = req.body;
  const questions = ids.map(qid => getQuestionPayload(qid as QuestionId)).filter(q => !!q);

  if (questions.length) res.status(200).json(questions);
  else next(error(404, 'Questions not found'));
});

app.post('/api/questions/add', (req: Request<QuestionPayload>, res: Response, next: NextFunction) => {
  const question = addQuestion(req.body);
  console.log('add question', question);
  if (question) res.status(200).json(question);
  else next(error(404, 'Something went awry'));
});

app.post('/api/questions/update', (req: Request<QuestionPayload>, res: Response, next: NextFunction) => {
  const check = updateQuestion(req.body);
  if (check) res.status(200).json(true);
  else next(error(404, 'Something went awry'));
});

/** Error handeling */
app.use(function (err: { status: HttpStatusCode; msg: string }, req: unknown, res: Response) {
  console.log('THIS: ', res.status);
  res?.status?.(err.status || 500);
  res?.send?.({ error: err.msg });
});

app.use(function (req, res: Response) {
  res.send({ error: "Sorry, can't find that" });
});

app.listen(port, () => {
  console.log(`Express started on port ${port}`);
});
