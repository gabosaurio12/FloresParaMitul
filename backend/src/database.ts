import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbPromise = open({
    filename: "proposals.db",
    driver: sqlite3.Database,
});

export async function initializeDatabase() {
    const db = await dbPromise;

    await db.exec(`
        CREATE TABLE IF NOT EXISTS proposals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            flower TEXT NOT NULL,
            date TEXT NOT NULL,
            custom_date TEXT,
            time_of_day TEXT,
            time TEXT NOT NULL,
            activity TEXT,
            favorite_food TEXT,
            disliked_food TEXT,
            favorite_place TEXT,
            selected_plan TEXT,
            things_to_avoid TEXT,
            other_idea TEXT,
            additional_message TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

export async function saveProposal(proposalData: any) {
    const db = await dbPromise;

    const result = await db.run(
        `
        INSERT INTO proposals (
            flower,
            date,
            custom_date,
            time_of_day,
            time,
            activity,
            favorite_food,
            disliked_food,
            favorite_place,
            selected_plan,
            things_to_avoid,
            other_idea,
            additional_message
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            proposalData.flower,
            proposalData.date,
            proposalData.customDate,
            proposalData.timeOfDay,
            proposalData.time,
            proposalData.activity,
            proposalData.favoriteFood,
            proposalData.dislikedFood,
            proposalData.favoritePlace,
            proposalData.selectedPlan,
            proposalData.thingsToAvoid,
            proposalData.otherIdea,
            proposalData.additionalMessage,
        ]
    );

    return result.lastID;
}