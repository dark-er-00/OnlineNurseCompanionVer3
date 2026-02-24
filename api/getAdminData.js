import { getRawSheetData } from "./sheets";

function computeUrgency(row) {
  const painLevel = parseInt(row[6]) || 0; // Column 7
  const dangerFlag = (row[7] || "").toLowerCase(); // Column 8
  const canAttend = (row[8] || "").toLowerCase(); // Column 9

  if (dangerFlag === "yes" || painLevel >= 8 || (canAttend === "no" && painLevel >= 6)) {
    return "High";
  }

  if ((painLevel >= 4 && painLevel <= 7) || canAttend === "no") {
    return "Medium";
  }

  return "Low";
}

export default async function handler(req, res) {
  try {
    const rawData = await getRawSheetData(); // returns 2D array

    // Ignore header row
    const cleanedData = rawData.slice(1);

    // Add urgency as 11th column
    const enhancedData = cleanedData.map((row, index) => {
      row.push(computeUrgency(row)); // urgency = 11th column
      row._sheetIndex = index;       // attach sheet index for frontend
      return row;
    });

    res.status(200).json(enhancedData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}