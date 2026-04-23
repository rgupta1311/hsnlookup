// Compute the full landed-cost breakdown for a given assessable value.
// Follows the standard Indian customs computation:
//   1. BCD = assessableValue * bcd%
//   2. SWS = BCD * sws%  (Social Welfare Surcharge, levied on BCD)
//   3. Compensation cess = (assessableValue + BCD) * cess%
//   4. IGST = (assessableValue + BCD + SWS + cess) * igst%
//   5. Total duty = BCD + SWS + cess + IGST
//   6. Landed cost = assessableValue + total duty
export function computeDuty(assessableValue, rates) {
  const av = assessableValue;
  const bcd = +(av * (rates.bcd / 100)).toFixed(2);
  const sws = +(bcd * (rates.sws / 100)).toFixed(2);
  const cess = +((av + bcd) * (rates.cess / 100)).toFixed(2);
  const igstBase = av + bcd + sws + cess;
  const igst = +(igstBase * (rates.igst / 100)).toFixed(2);
  const totalDuty = +(bcd + sws + cess + igst).toFixed(2);
  const landed = +(av + totalDuty).toFixed(2);
  const effectiveRate = +((totalDuty / av) * 100).toFixed(2);
  return { av, bcd, sws, cess, igst, totalDuty, landed, effectiveRate };
}

export const inr = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });
