import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPatientById,
  getComplaintsByPatientId,
} from "../services/DatabaseService";
import type { Patient } from "../models/Patient.model";
import type { Complaint } from "../models/Complaint.model";

const ViewPatient = () => {
  const { patientId } = useParams();
  const [inputId, setInputId] = useState("");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async (id: number) => {
    try {
      const fetchedPatient = await getPatientById(id);
      if (!fetchedPatient) {
        setError("Patient with that ID does not exist in the system.");
        setPatient(null);
        return;
      }
      const fetchedComplaints = await getComplaintsByPatientId(id);
      setPatient(fetchedPatient);
      setComplaints(
        fetchedComplaints.sort((a, b) => b.date.localeCompare(a.date))
      );
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("An error occurred while loading data.");
    }
  };

  useEffect(() => {
    if (patientId) {
      const idNum = parseInt(patientId);
      if (!isNaN(idNum)) {
        fetchData(idNum);
      } else {
        setError("Invalid patient ID in URL.");
      }
    }
  }, [patientId]);

  const handleSearch = () => {
    const idNum = parseInt(inputId);
    if (!isNaN(idNum)) {
      navigate(`/view-patient/${idNum}`);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (!patientId) {
    return (
      <div>
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-blue-600">
            Enter Patient Id.
          </h1>
          <p className="mt-2 text-[12px] text-blue-600">
            Enter ID of the patient you want to view.
          </p>
        </header>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="border p-2 rounded w-40"
            placeholder="Enter Patient ID"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
        <p className="text-gray-700 mb-4">{error}</p>
        <a href="/" className="text-blue-600 underline">
          Back to Dashboard
        </a>
      </div>
    );
  }

  if (!patient) {
    return <div></div>;
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">Patient Details.</h1>
        <p className="mt-2 text-[12px] text-blue-600">
          Personal details and medical history of the Patient.
        </p>
      </header>
      <div className="space-y-2 text-gray-800">
        <p>
          <strong>ID:</strong> {patient.id}
        </p>
        <p>
          <strong>Name:</strong> {patient.name}
        </p>
        <p>
          <strong>Phone:</strong> {patient.phone}
        </p>
        <p>
          <strong>Address:</strong> {patient.address || "NA"}
        </p>
        <p>
          <strong>Email:</strong> {patient.email || "NA"}
        </p>
        <p>
          <strong>Age:</strong> {calculateAge(patient.dob)}
        </p>
        <p>
          <strong>Date of Birth:</strong> {new Date(patient.dob).toLocaleDateString()}
        </p>
        <p>
          <strong>Sex:</strong> {patient.sex}
        </p>
        <p>
          <strong>Height:</strong>{" "}
          {patient.height != null ? `${patient.height} cm` : "NA"}
        </p>
        <p>
          <strong>Weight:</strong>{" "}
          {patient.weight != null ? `${patient.weight} kg` : "NA"}
        </p>
        <p>
          <strong>Registered On:</strong>{" "}
          {patient.created_at
            ? new Date(patient.created_at).toLocaleDateString()
            : "NA"}
        </p>
      </div>

      <h2 className="text-xl font-semibold text-blue-600 mt-10">
        Medical History
      </h2>
      {complaints.length === 0 ? (
        <p className="text-gray-700 italic">No complaints made.</p>
      ) : (
        <div className="space-y-4 text-gray-800">
          {complaints.map((c) => (
            <div key={c.id} className="border-l-4 border-blue-400 pl-4">
              <p>
                <strong>Date:</strong> {new Date(c.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Complaint:</strong> {c.complaint}
              </p>
              <p>
                <strong>Doctor:</strong> {c.doctor}
              </p>
              <p>
                <strong>Medicine:</strong> {c.medicine}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewPatient;
