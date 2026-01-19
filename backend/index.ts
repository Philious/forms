import cookieSession from 'cookie-session';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
// import { v4 as uuid } from 'uuid';
import { Division, DivisionId, Entry, EntryId, Form, FormId, HttpStatusCode, Page, PageId } from '@cs-forms/shared';
import {
  deleteDivision,
  deleteEntry,
  deleteForm,
  deletePage,
  divisionMap,
  entryMap,
  formMap,
  getDivision,
  getEntry,
  getForm,
  getPage,
  pageMap,
  setDivision,
  setEntry,
  setForm,
  setPage,
} from './store.js';

const app = express();
const port = 3000;
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

app.get('/api/get/user', (req, res) => {
  if (req.session && !req.session.user) {
    req.session.user = { id: '123', name: 'Aadvark' };
    res.json({ status: 'logged in' });
  }
  console.log('LOGGED IN');
  res.json(req.session?.user);
});

function error(status: HttpStatusCode, msg: string) {
  var err = new Error(msg) as Error & { status: HttpStatusCode };
  err['status'] = status;

  return err;
}

type All = {
  forms: Record<FormId, Form>;
  pages: Record<PageId, Page>;
  divisions: Record<DivisionId, Division>;
  entries: Record<EntryId, Entry>;
};

app.get('/api/get/all', (req: Request, res: Response<All>, next: NextFunction) => {
  const forms: Record<FormId, Form<'array'>> = {};
  const pages: Record<PageId, Page<'array'>> = {};
  const divisions: Record<DivisionId, Division<'array'>> = {};
  const entries = Object.fromEntries(entryMap);
  formMap.forEach(f => {
    const retrieved = getForm(f.id);
    if (retrieved) forms[f.id] = retrieved;
  });
  pageMap.forEach(p => {
    const retrieved = getPage(p.id);
    if (retrieved) pages[p.id] = retrieved;
  });
  divisionMap.forEach(d => {
    const retrieved = getDivision(d.id);
    if (retrieved) divisions[d.id] = retrieved;
  });

  try {
    res.status(200).json({ forms, pages, divisions, entries });
  } catch (err) {
    next(error(500, `Internal server error ${err}`));
  }
});

app.get('/api/get/all/forms', (_: Request, res: Response<Form[]>, next: NextFunction) => {
  const forms: Form[] = [];
  formMap.forEach(f => {
    const retrieved = getForm(f.id);
    if (retrieved) forms.push(retrieved);
  });
  if (forms.length) res.status(200).json(forms);
  else next(error(500, 'Internal server error'));
});

app.get('/api/get/all/entries', (_: Request, res: Response<Entry[]>, next: NextFunction) => {
  const entries: Entry[] = [];
  entryMap.forEach(e => {
    const retrieved = getEntry(e.id);
    if (retrieved) entries.push(retrieved);
  });
  if (entries.length) res.status(200).json(entries);
  else next(error(500, 'Internal server error'));
});

app.get('/api/get/form/:formId', (req: Request<{ formId: FormId }>, res: Response<Form<'array'>>, next: NextFunction) => {
  const { formId } = req.params;
  const form = getForm(formId);

  if (form) res.status(200).json(form);
  else next(error(500, `No form with id ${formId}`));
});

app.get('/api/get/page/:pageId', (req: Request<{ pageId: PageId }>, res: Response<Page<'array'>>, next: NextFunction) => {
  const { pageId } = req.params;
  const page = getPage(pageId);

  if (page) res.status(200).json(page);
  else next(error(500, `No page with id ${pageId}`));
});

app.get('/api/get/division/:divisionId', (req: Request<{ divisionId: DivisionId }>, res: Response<Division<'array'>>, next: NextFunction) => {
  const { divisionId } = req.params;
  const division = getDivision(divisionId);
  console.log('get div: ', req.params, division);
  if (division) res.status(200).json(division);
  else next(error(500, `No division with id ${divisionId}`));
});

app.get('/api/get/entry/:entryId', (req: Request<{ entryId: EntryId }>, res: Response<Entry>, next: NextFunction) => {
  const { entryId } = req.params;
  const entry = getEntry(entryId);

  if (entry) res.status(200).json(entry);
  else next(error(500, `Internal server error, Could not find ${entryId}`));
});

type Body = {
  formId?: FormId;
  pageIds?: PageId[];
  divisionIds?: DivisionId[];
  entryId?: EntryId[];
};

app.post('/api/set/entry', (req: Request<Entry>, res: Response, next: NextFunction) => {
  const entry: Entry = req.body;

  console.log('save entry: ', entry);

  try {
    setEntry(entry);
    res.sendStatus(204);
  } catch (err) {
    next(error(500, `Internal server error ${err}`));
  }
});

app.post('/api/set/division', (req: Request<Division>, res: Response, next: NextFunction) => {
  const division = req.body;
  console.log('save division', req.body);
  try {
    setDivision(division);
    res.sendStatus(204);
  } catch (err) {
    next(error(500, `Internal server error ${err}`));
  }
});

app.post('/api/set/page', (req: Request<Page>, res: Response, next: NextFunction) => {
  const page = req.body;
  console.log('save page');
  try {
    setPage(page);
    res.sendStatus(204);
  } catch (err) {
    next(error(500, `Internal server error ${err}`));
  }
});

app.post('/api/set/form', (req: Request<Form>, res: Response, next: NextFunction) => {
  const form = req.body;
  console.log('save form');
  try {
    setForm(form);
    res.sendStatus(204);
  } catch (err) {
    next(error(500, `Internal server error ${err}`));
  }
});

app.delete('/api/delete/:formId', (req: Request<FormId>, res: Response): void => {
  const id = req.params;
  deleteForm(id);
  res.sendStatus(204);
});

app.delete('/api/delete/:pageId', (req: Request<PageId>, res: Response): void => {
  const id = req.params;
  deletePage(id);
  res.sendStatus(204);
});

app.delete('/api/delete/:divisionId', (req: Request<DivisionId>, res: Response): void => {
  const id = req.params;
  deleteDivision(id);
  res.sendStatus(204);
});

app.delete('/api/delete/:entryId', (req: Request<EntryId>, res: Response): void => {
  const id = req.params;
  deleteEntry(id);
  res.sendStatus(204);
});

/** Error handeling */
app.use(function (err: { status: HttpStatusCode; msg: string }, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || 500).send({ error: err.msg });
});

app.use(function (req, res: Response) {
  console.warn(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Express started on port ${port}`);
});
