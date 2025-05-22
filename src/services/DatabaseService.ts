import { PGliteWorker } from "@electric-sql/pglite/worker";
import type { Patient } from "../models/Patient.model";

let database: PGliteWorker | null = null;

const initSchema = async (db: PGliteWorker) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT,
        email TEXT,
        dob TEXT NOT NULL,
        sex TEXT NOT NULL,
        height REAL,
        weight REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS complaints (
        id INTEGER PRIMARY KEY,
        patient_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        complaint TEXT NOT NULL,
        doctor TEXT NOT NULL,
        medicine TEXT NOT NULL,
        FOREIGN KEY(patient_id) REFERENCES patients(id)
      );

  `);
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_patient_name ON patients (name);
  `);

  console.log("Database schema initialized");
};
export const initDatabase = async (): Promise<PGliteWorker> => {
  if (!database) {
    try {
      const workerInstance = new Worker(
        new URL("/pglite-worker.js", import.meta.url),
        {
          type: "module",
        }
      );
      database = new PGliteWorker(workerInstance);
      await initSchema(database);
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }
  return database;
};

export const getAllPatients = async (): Promise<Patient[]> => {
  const database = await initDatabase();
  try {
    const result = await database.query("SELECT * FROM patients");
    return result.rows as Patient[];
  } catch (error) {
    console.error("Error executing getAllPatients query:", error);
    throw error;
  }
};

export const registerPatient = async (patient: Patient): Promise<number | undefined> => {
  const database = await initDatabase();
  try {
    const result = await database.query(
      `INSERT INTO patients (name, phone, address, email, dob, sex, height, weight) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [patient.name, patient.phone, patient.address ||  null, patient.email || null, patient.dob, patient.sex, patient.height || null, patient.weight || null]
    );
    const inserted = result.rows?.[0] as Patient;

    if (inserted === undefined) {
      throw new Error("Failed to retrieve inserted patient ID");
    }

    return inserted.id;
  } catch (error) {
    console.error("Error executing registerPatiet query:", error);
    throw error;
  }
};
