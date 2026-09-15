export type HorecaItem = { id: string; name: string; quantity: number };

export function normalizeRut(value: string) {
  return value.replace(/\./g, "").replace(/\s/g, "").toUpperCase();
}

export function isValidRut(value: string) {
  const rut = normalizeRut(value);
  if (!/^\d{7,8}-[\dK]$/.test(rut)) return false;
  const [body, dv] = rut.split("-");
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const remainder = 11 - (sum % 11);
  const expected = remainder === 11 ? "0" : remainder === 10 ? "K" : String(remainder);
  return expected === dv;
}

export function validateHorecaDate(value: string) {
  const selected = new Date(`${value}T12:00:00`);
  if (Number.isNaN(selected.getTime())) return false;
  if (![4, 5, 6].includes(selected.getDay())) return false;
  const min = new Date();
  min.setHours(min.getHours() + 72);
  return selected >= min;
}
