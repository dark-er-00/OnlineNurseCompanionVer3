import { getRawSheetData } from "./sheets";

export default async function handler(req, res) {
  try {
    const rawData = await getRawSheetData();

    // Ignore first row (header)
    const cleanedData = rawData.slice(1);

    res.status(200).json(cleanedData);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}