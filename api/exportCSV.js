import { getAdminData } from "./getAdminData";

export default async function handler(req, res) {
    try {
        // Fetch your data from wherever you store it (e.g., Google Sheets, DB)
        const data = await getAdminData(); // implement this

        // Build CSV string
        let csv = "Date/Time,Student Name,Course/Year/Section,Email,Symptoms,Duration,Pain,Danger,Can Attend,Status,Urgency\n";
        data.forEach(row => {
            // Escape commas in values
            const escapedRow = row.map(v => `"${(v || "").toString().replace(/"/g, '""')}"`);
            csv += escapedRow.join(",") + "\n";
        });

        // Set headers so browser downloads file
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=admin_data.csv");

        res.status(200).send(csv);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate CSV" });
    }
}