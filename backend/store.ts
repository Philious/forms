import { Division, DivisionId, Entry, EntryId, EntryTypeEnum, Form, FormId, Locale, Page, PageId, Translation } from '@cs-forms/shared';
import { v4 as uid } from 'uuid';

type Ids = { entryIds?: EntryId[]; divisionIds?: DivisionId[]; pageIds?: PageId[]; formIds?: FormId[] };
const formId = uid();
const pageId = uid();
const divisionId = uid();
const entryId = uid();

export const formMap = new Map<FormId, Form<'array'>>([
  [
    formId,
    {
      id: formId,
      label: {
        [Locale.SV]: 'Form1-sv',
        [Locale.EN]: 'Form1-en',
        [Locale.NB]: 'Form1-nb',
        [Locale.XX]: 'form1',
      },
      pages: [pageId],
      divisions: [divisionId],
      entries: [entryId],
      updated: new Date().valueOf(),
    },
  ],
]);
export const pageMap = new Map<PageId, Page<'array'>>([
  [
    pageId,
    {
      id: pageId,
      forms: [formId],
      label: {
        [Locale.SV]: 'Page1-sv',
        [Locale.EN]: 'Page1-en',
        [Locale.NB]: 'Page1-nb',
        [Locale.XX]: 'form1.page1',
      },

      divisions: [divisionId],
      entries: [entryId],
      updated: new Date().valueOf(),
    },
  ],
]);
export const divisionMap = new Map<DivisionId, Division<'array'>>([
  [
    divisionId,
    {
      id: divisionId,
      forms: [formId],
      pages: [pageId],
      label: {
        [Locale.SV]: 'Division1-sv',
        [Locale.EN]: 'Division1-en',
        [Locale.NB]: 'Division1-nb',
        [Locale.XX]: 'form1.page1.division1',
      },

      entries: [entryId],
      updated: new Date().valueOf(),
    },
  ],
]);
const translation: Translation = {
  [Locale.SV]: 'Entry1-sv',
  [Locale.EN]: 'Entry1-en',
  [Locale.NB]: 'Entry1-nb',
  [Locale.XX]: 'form1.page1.division1.entry1',
};

export const entryMap = new Map<EntryId, Entry>([
  [
    entryId,
    {
      id: entryId,
      type: EntryTypeEnum.RadioGroup,
      label: translation,
      entrySpecific: {
        options: [
          {
            label: {
              [Locale.SV]: 'Ja',
              [Locale.EN]: 'Yes',
              [Locale.NB]: 'Greit',
              [Locale.XX]: 'general.yes',
            },
            value: 1,
          },
          {
            label: {
              [Locale.SV]: 'Nej',
              [Locale.EN]: 'No',
              [Locale.NB]: 'Naj',
              [Locale.XX]: 'general.no',
            },
            value: 2,
          },
        ],
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
