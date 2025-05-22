import { useEffect, useState } from "react";
import { useDatabaseContext } from "../context/DatabaseContext";
import { getAllPatients } from "../services/DatabaseService";
import { FileUser, PersonStanding, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { isLoading, isInitialized, error } = useDatabaseContext();
  const [patientCount, setPatientCount] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      if (isInitialized) {
        try {
          const patients = await getAllPatients();
          setPatientCount(patients.length);
        } catch (err) {
          console.error("Error loading dashboard data:", err);
        }
      }
    };

    loadData();
  }, [isInitialized]);

  const dashboardCards = [
    {
      icon: <PersonStanding size={40} />,
      heading: "Patients",
      description: "Total registered patients: " + patientCount,
      to: "/patients",
    },
    {
      icon: <Plus size={40} />,
      heading: "Register Patient",
      description: "Add a new patient to the clinic",
      to: "/register-patient",
    },
    {
      icon: <FileUser size={40} />,
      heading: "View Patient",
      description: "View a patient's record",
      to: "/view-patient",
    },
  ];

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <div>Error Failed to Load</div>;
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">
          Welcome to your Clinic.
        </h1>
        <p className="mt-2 text-[12px] text-blue-600">
          Here are your Patients. Choose an option.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card, index) => (
          <Link to={card.to} className="text-blue-500 text-sm" key={index}>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-between hover:shadow-lg transition hover:bg-blue-100">
              <div className="text-4xl text-blue-600 mb-4">{card.icon}</div>
              <h2 className="text-lg font-semibold text-center">
                {card.heading}
              </h2>
              <p className="text-gray-600 text-center mt-2 pb-5">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
