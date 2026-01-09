import { Division, DivisionId, Entry, EntryId, EntryTypeEnum, Form, FormId, Locale, Page, PageId } from '@cs-forms/shared';
import { v4 as uid } from 'uuid';

type Ids = { entryIds?: EntryId[]; divisionIds?: DivisionId[]; pageIds?: PageId[]; formIds?: FormId[] };

export const formMap = new Map<FormId, Form<'array'>>();
export const pageMap = new Map<PageId, Page<'array'>>();
export const divisionMap = new Map<DivisionId, Division<'array'>>();
export const entryMap = new Map<EntryId, Entry>([
  [
    'Entry 1',
    {
      id: uid(),
      type: EntryTypeEnum.RadioGroup,
      label: {
        [Locale.SE]: 'Entry 1',
        [Locale.EN]: 'Entry 1',
        [Locale.NB]: 'Entry 1',
        [Locale.XX]: '',
      },
      entrySpecific: {
        selected: '',
        options: [],
      },
      updated: new Date().valueOf(),
    },
  ],
]);

const mergArr = (arr1: string[], arr2: string[]) => [...new Set(arr1.concat(arr2))];

export const setForm = (form: Form) => {
  const formUpdate: Form<'array'> = {
    ...form,
    label: form.label,
    updated: new Date().valueOf(),
  };
  formMap.set(form.id, formUpdate);
};

export const setPage = (page: Page) => {
  const pageUpdate: Page<'array'> = {
    ...page,
    label: page.label,
    updated: new Date().valueOf(),
  };
  page.forms.forEach(id => formMap.get(id)?.pages?.push(page.id));

  pageMap.set(page.id, pageUpdate);
};

export const setDivision = (division: Division) => {
  const div: Division<'array'> = {
    ...division,
    label: division.label,
    updated: new Date().valueOf(),
  };
  div.forms.forEach(id => formMap.get(id)?.divisions?.push(division.id));
  div.pages.forEach(id => pageMap.get(id)?.divisions?.push(division.id));

  divisionMap.set(div.id, div);
};

export const setEntry = (entry: Entry) => {
  entryMap.set(entry.id, entry);
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

export const getDivision = (id: DivisionId): Division<'array'> | null => {
  const division = divisionMap.get(id) as Division<'array'>;
  const entries = new Set<EntryId>();

  division?.entries.forEach((eid: EntryId) => {
    const entry = entryMap.get(eid);
    if (entry) entries.add(entry.id);
  });

  return division ? { ...division, entries: [...entries] } : null;
};

export const getPage = (id: PageId): Page<'array'> | null => {
  const page = pageMap.get(id);
  const divisions = new Set<DivisionId>();
  const entries = new Set<EntryId>();

  page?.divisions.forEach((did: DivisionId) => {
    divisions.add(did);
    divisionMap.get(did)?.entries.forEach((eid: EntryId) => {
      const entry = entryMap.get(eid);
      if (entry) entries.add(entry.id);
    });
  });

  return page ? { ...page, divisions: [...divisions], entries: [...entries] } : null;
};

export const getForm = (id: FormId): Form<'array'> | null => {
  const form = formMap.get(id);
  const pages = new Set<PageId>();
  const divisions = new Set<DivisionId>();
  const entries = new Set<EntryId>();

  form?.pages.forEach((pid: PageId) => {
    pages.add(pid);
    pageMap.get(pid)?.divisions.forEach((did: DivisionId) => {
      divisions.add(did);
      divisionMap.get(did)?.entries.forEach((eid: EntryId) => {
        const entry = entryMap.get(eid);
        if (entry) entries.add(entry.id);
      });
    });
  });

  return form ? { ...form, pages: [...pages], divisions: [...divisions], entries: [...entries] } : null;
};

export const getAllForms = (): Map<FormId, Form<'array'>> | null => {
  const formCollection = new Map<FormId, Form<'array'>>();

  formMap.forEach(f => {
    const form = getForm(f.id);
    if (form) {
      formCollection.set(form.id, form);
    }
  });

  return formCollection ?? null;
};

export const deleteForm = (id: FormId) => {};

export const deletePage = (id: PageId) => {};

export const deleteDivision = (id: DivisionId) => {};

export const deleteEntry = (id: EntryId) => {};
