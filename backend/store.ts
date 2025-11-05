import { Division, DivisionId, Entry, EntryId, EntryTypeEnum, Form, FormId, Page, PageId } from '@cs-forms/shared';
import { v4 as uid } from 'uuid';

type Ids = { entryIds?: EntryId[]; divisionIds?: DivisionId[]; pageIds?: PageId[]; formIds?: FormId[] };

export const formMap = new Map<FormId, Form>();
export const pageMap = new Map<PageId, Page>();
export const divisionMap = new Map<DivisionId, Division>();
export const entryMap = new Map<EntryId, Entry>([
  ['Entry 1', { id: uid(), type: EntryTypeEnum.RadioGroup, label: 'Entry 1', updated: new Date().valueOf() }],
]);

export const setForm = (id: FormId, ids?: Ids) => {
  const form: Form = {
    id,
    pages: new Set(),
    divisions: new Set(),
    entries: new Set(),
    updated: new Date().valueOf(),
  };
  formMap.set(form.id, form);
};

export const setPage = (id: PageId, ids?: Ids) => {
  const page: Page = {
    id,
    divisions: new Set(),
    entries: new Set(),
    updated: new Date().valueOf(),
  };
  pageMap.set(page.id, page);

  ids?.formIds?.forEach(f => {
    if (!formMap.has(f)) {
      setForm(f, ids);
    }
    formMap.get(f)?.pages.add(id);
    ids.divisionIds?.forEach(d => formMap.get(f)?.divisions.add(d));
    ids.entryIds?.forEach(e => formMap.get(f)?.entries.add(e));
  });
};

export const setDivision = (id: DivisionId, ids?: Ids) => {
  const div: Division = {
    id,
    entries: new Set(),
    updated: new Date().valueOf(),
  };
  divisionMap.set(div.id, div);

  ids?.pageIds?.forEach(p => {
    if (!pageMap.has(p)) {
      setPage(p, ids);
    }
    pageMap.get(p)?.divisions.add(id);
    ids.entryIds?.forEach(e => pageMap.get(p)?.entries.add(e));
  });
};

export const setEntry = (entry: Entry, ids?: Ids) => {
  entryMap.set(entry.id, entry);

  ids?.divisionIds?.forEach(d => {
    if (!divisionMap.has(d)) {
      setDivision(d, ids);
    }
    divisionMap.get(d)?.entries.add(entry.id);
  });
  console.log(entryMap);
};

export const set = { form: setForm, page: setPage, division: setDivision, entry: setEntry };

export const getEntry = (id: EntryId) => (entryMap.has(id) ? entryMap.get(id)! : null);

export const getEntries = (ids: Set<EntryId>): Map<EntryId, Entry> => {
  const entries = new Map<EntryId, Entry>();

  ids.forEach(id => {
    const entry = entryMap.get(id);
    if (entry) {
      entries.set(entry.id, entry);
    }
  });

  return entries ?? null;
};

export const getDivision = (id: DivisionId): Division<'id'> | null => {
  const division = divisionMap.get(id) as Division<'id'>;
  const entries = new Set<EntryId>();

  division?.entries.forEach(eid => {
    const storedEntry = entryMap.get(eid);
    if (storedEntry) entries.add(storedEntry.id);
  });

  return division ? { ...division, entries } : null;
};

export const getPage = (id: PageId): Page<'id'> | null => {
  const page = pageMap.get(id);
  const entries = new Set<EntryId>();

  page?.divisions.forEach(did => {
    divisionMap.get(did)?.entries.forEach(eid => {
      const storedEntry = entryMap.get(eid);
      if (storedEntry) entries.add(storedEntry.id);
    });
  });

  return page ? { ...page, entries } : null;
};

export const getForm = (id: FormId): Form<'id'> | null => {
  const storedForm = formMap.get(id);
  const entries = new Set<EntryId>();

  storedForm?.pages.forEach(pid => {
    pageMap.get(pid)?.divisions.forEach(did => {
      divisionMap.get(did)?.entries.forEach(eid => {
        const storedEntry = entryMap.get(eid);
        if (storedEntry) entries.add(storedEntry.id);
      });
    });
  });

  return storedForm ? { ...storedForm, entries } : null;
};

export const getAllForms = (): Map<FormId, Form> | null => {
  const formCollection = new Map<FormId, Form>();

  formMap.forEach(form => {
    formCollection.set(form.id, form);
  });

  return formCollection ?? null;
};

export const deleteForm = (id: FormId) => {};

export const deletePage = (id: PageId) => {};

export const deleteDivision = (id: DivisionId) => {};

export const deleteEntry = (id: EntryId) => {};
