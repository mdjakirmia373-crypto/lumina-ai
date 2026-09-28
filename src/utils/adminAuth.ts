// Helper to verify if an email belongs to the verified website creator / owner

export const CREATOR_EMAIL = 'mdjakirmia373@gmail.com';

export function isOwnerUser(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return clean === 'mdjakirmia373@gmail.com' || clean === 'mdjakirhossain@gmail.com';
}
