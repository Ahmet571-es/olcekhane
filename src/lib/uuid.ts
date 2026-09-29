/** Formlardan gelen kimliklerin UUID biçiminde olup olmadığını denetler (hatalı girdi 500 hatasına yol açmasın). */
export function isUuid(v: unknown): v is string {
  return typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}
