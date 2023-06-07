export interface ICompany {
  id: number;
  name?: string | null;
  crn?: string | null;
  description?: string | null;
  email?: string | null;
  streetAdress?: string | null;
  city?: string | null;
  country?: string | null;
  ceoName?: string | null;
}

export type NewCompany = Omit<ICompany, 'id'> & { id: null };
