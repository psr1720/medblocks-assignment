import { useEffect, useState } from "react";
import { useDatabaseContext } from "../context/DatabaseContext";
import { getAllPatients, insertComplaint } from "../services/DatabaseService";
import type { Patient } from "../models/Patient.model";
import type { Complaint } from "../models/Complaint.model";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  const { isLoading, isInitialized, error } = useDatabaseContext();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeComplaintPatientId, setActiveComplaintPatientId] = useState<
    number | null
  >(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [complaintForm, setComplaintForm] = useState<
    Omit<Complaint, "id" | "patient_id">
  >({
    date: "",
    complaint: "",
    doctor: "",
    medicine: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (isInitialized) {
        try {
          const patients = await getAllPatients();
          setPatients(patients);
          setFilteredPatients(patients);
        } catch (err) {
          console.error("Error loading patients:", err);
        }
      }
    };

    loadData();
  }, [isInitialized]);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSearch = () => {
    const filtered = patients.filter((p) =>
      p.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredPatients(patients);
  };

  const handleComplaintChange = (field: keyof Complaint, value: string) => {
    setComplaintForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof Complaint) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid =
    complaintForm.date.trim() &&
    complaintForm.complaint.trim() &&
    complaintForm.doctor.trim() &&
    complaintForm.medicine.trim();

  const handleSubmitComplaint = async (patientId: number) => {
    try {
      await insertComplaint({ ...complaintForm, patient_id: patientId });
      setActiveComplaintPatientId(null);
      setComplaintForm({ date: "", complaint: "", doctor: "", medicine: "" });
    } catch (err) {
      console.error("Failed to submit complaint:", err);
    }
  };

  if (isLoading) return <div></div>;
  if (error) return <div>Error loading data.</div>;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">
          Registered Patients.
        </h1>
        <p className="mt-2 text-[12px] text-blue-600">
          All registered patients. Search for a patient, View Details or Log a Patient Complaint.
        </p>
      </header>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="border border-gray-300 px-3 py-1 rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-400 text-white px-3 py-1 rounded"
        >
          Clear
        </button>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Age</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Sex</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient.id} className="border-b">
              <td className="p-2 border text-center">{patient.id}</td>
              <td className="p-2 border">{patient.name}</td>
              <td className="p-2 border text-center">
                {calculateAge(patient.dob)}
              </td>
              <td className="p-2 border">{patient.phone}</td>
              <td className="p-2 border text-center">{patient.sex}</td>
              <td className="p-2 border text-center space-x-2">
                <button
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() =>
                    setActiveComplaintPatientId(
                      activeComplaintPatientId === patient.id
                        ? null
                        : patient.id!
                    )
                  }
                >
                  File Complaint
                </button>
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded"
                  onClick={() => navigate(`/view-patient/${patient.id}`)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}

          {activeComplaintPatientId && (
            <tr className="bg-gray-50 border">
              <td colSpan={6} className="p-4">
                <div className="grid grid-cols-1 gap-3">
                  {(() => {
                    const patient = patients.find(
                      (p) => p.id === activeComplaintPatientId
                    );
                    return patient ? (
                      <div className="text-sm text-gray-700 font-medium mb-2">
                        <span>Filing complaint for:</span>{" "}
                        <span>
                          #{patient.id} - {patient.name}
                        </span>
                      </div>
                    ) : null;
                  })()}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className={`border p-2 rounded w-full ${
                        touchedFields.date && !complaintForm.date
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      value={complaintForm.date}
                      onChange={(e) =>
                        handleComplaintChange("date", e.target.value)
                      }
                      onBlur={() => handleBlur("date")}
                    />
                    {touchedFields.date && !complaintForm.date && (
                      <p className="text-xs text-red-500">Date is required.</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Complaint <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`border p-2 rounded w-full ${
                        touchedFields.complaint && !complaintForm.complaint
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      value={complaintForm.complaint}
                      onChange={(e) =>
                        handleComplaintChange("complaint", e.target.value)
                      }
                      onBlur={() => handleBlur("complaint")}
                      placeholder="Enter complaint"
                    />
                    {touchedFields.complaint && !complaintForm.complaint && (
                      <p className="text-xs text-red-500">
                        Complaint is required.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Doctor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`border p-2 rounded w-full ${
                        touchedFields.doctor && !complaintForm.doctor
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      value={complaintForm.doctor}
                      onChange={(e) =>
                        handleComplaintChange("doctor", e.target.value)
                      }
                      onBlur={() => handleBlur("doctor")}
                      placeholder="Doctor's name"
                    />
                    {touchedFields.doctor && !complaintForm.doctor && (
                      <p className="text-xs text-red-500">
                        Doctor's name is required.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Medicine <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`border p-2 rounded w-full ${
                        touchedFields.medicine && !complaintForm.medicine
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      value={complaintForm.medicine}
                      onChange={(e) =>
                        handleComplaintChange("medicine", e.target.value)
                      }
                      onBlur={() => handleBlur("medicine")}
                      placeholder="Prescribed medicine"
                    />
                    {touchedFields.medicine && !complaintForm.medicine && (
                      <p className="text-xs text-red-500">
                        Medicine is required.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      className={`px-3 py-1 rounded ${
                        isFormValid
                          ? "bg-blue-600 text-white"
                          : "bg-gray-400 text-white cursor-not-allowed"
                      }`}
                      disabled={!isFormValid}
                      onClick={() =>
                        handleSubmitComplaint(activeComplaintPatientId)
                      }
                    >
                      Submit
                    </button>
                    <button
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setActiveComplaintPatientId(null);
                        setComplaintForm({
                          date: "",
                          complaint: "",
                          doctor: "",
                          medicine: "",
                        });
                        setTouchedFields({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Patients;
