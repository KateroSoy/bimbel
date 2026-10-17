/** Payment accounts entered by the admin in Pengaturan Lembaga, one per line: "Name | Number | Holder". */
export interface PaymentAccount { name: string; number: string; holder: string }

export function parseAccounts(text?: string | null): PaymentAccount[] {
  return (text ?? '')
    .split(/\r?\n/)
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter(([name, number]) => name && number)
    .map(([name, number, holder = '']) => ({ name, number, holder }));
}

export const formatAccounts = (accounts: PaymentAccount[]) =>
  accounts.map((a) => `• *${a.name}*: ${a.number}${a.holder ? ` a.n. ${a.holder}` : ''}`).join('\n');
