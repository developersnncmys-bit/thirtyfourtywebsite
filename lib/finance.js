// Home-loan maths used by the EMI calculator, loan eligibility and property pages

// Monthly instalment for a loan of `principal` at `annualRate`% over `years`
export function emi(principal, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (!principal || !n) return 0;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function loanSummary(principal, annualRate, years) {
  const monthly = emi(principal, annualRate, years);
  const total = monthly * years * 12;
  return { monthly, total, interest: total - principal };
}

// Largest loan whose EMI fits in `maxEmi`
export function principalFor(maxEmi, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (maxEmi <= 0) return 0;
  if (r === 0) return maxEmi * n;
  return (maxEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
}

// Year-by-year split of what you pay, for the amortisation table
export function schedule(principal, annualRate, years) {
  const r = annualRate / 12 / 100;
  const monthly = emi(principal, annualRate, years);
  let balance = principal;
  const rows = [];
  for (let y = 1; y <= years; y++) {
    let interest = 0;
    let paid = 0;
    for (let m = 0; m < 12 && balance > 0; m++) {
      const i = balance * r;
      const p = Math.min(monthly - i, balance);
      interest += i;
      paid += p;
      balance -= p;
    }
    rows.push({ year: y, principal: paid, interest, balance: Math.max(balance, 0) });
  }
  return rows;
}

export const DEFAULT_RATE = 8.5;
