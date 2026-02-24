import { getRawSheetData } from "./sheets";

function computeUrgency(row) {
  const painLevel = parseInt(row[6]) || 0; // Column 7
  const dangerFlag = (row[7] || "").toLowerCase(); // Column 8
  const canAttend = (row[8] || "").toLowerCase(); // Column 9

  // HIGH urgency
  if (
    dangerFlag === "yes" ||
    painLevel >= 8 ||
    (canAttend === "no" && painLevel >= 6)
  ) {
    return "High";
  }

  // MEDIUM urgency
  if (
    (painLevel >= 4 && painLevel <= 7) ||
    canAttend === "no"
  ) {
    return "Medium";
  }

  // LOW urgency
  return "Low";
}

export default async function handler(req, res) {
  try {
    const rawData = await getRawSheetData();

    // Ignore header row
    const cleanedData = rawData.slice(1);

    // Add urgency as 11th column
    const enhancedData = cleanedData.map(row => {
      const urgency = computeUrgency(row);
      return [...row, urgency]; // append as column 11
    });

    res.status(200).json(enhancedData);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}