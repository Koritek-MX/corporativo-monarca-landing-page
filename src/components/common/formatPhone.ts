export function formatPhone(phone: string): string {
  if (!phone) return "";

  // Quitar todo lo que no sea número
  const cleaned = phone.replace(/\D/g, "");

  // Solo aplicar formato si tiene 10 dígitos
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // Fallback (por si viene incompleto)
  return phone;
}