import { google } from "googleapis";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { rowIndex, status } = req.body; // rowIndex = 0-based index in Sheets (excluding header)
        const validStatuses = ["Pending Review", "Under Review", "Done"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        // Update column 11 (Status) in Google Sheets
        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `Sheet1!J${rowIndex + 2}`, // +2 because rowIndex is 0-based and first row = header
            valueInputOption: "RAW",
            requestBody: {
                values: [[status]],
            },
        });

        res.status(200).json({ message: "Status updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}