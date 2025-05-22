import { useState } from "react";
import { registerPatient } from "../services/DatabaseService";
import type { Patient } from "../models/Patient.model";
import { useNavigate } from "react-router-dom";

export default function RegisterPatient() {
  const [form, setForm] = useState<Patient>({
    name: "",
    phone: "",
    dob: "",
    sex: "male",
    address: "",
    email: "",
    height: undefined,
    weight: undefined,
  });

  const [touched, setTouched] = useState<{ [K in keyof Patient]?: boolean }>({});
  const [submitted, setSubmitted] = useState<"idle" | "success" | "error">("idle");

  const navigate = useNavigate();

  const isValid =
    form.name.trim() &&
    form.phone.trim() &&
    form.dob.trim() &&
    form.sex.trim();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "height" || name === "weight" ? parseFloat(value) || undefined : value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleReset = () => {
    setForm({
      name: "",
      phone: "",
      dob: "",
      sex: "male",
      address: "",
      email: "",
      height: undefined,
      weight: undefined,
    });
    setTouched({});
    setSubmitted("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = await registerPatient(form);
      if (id !== undefined) {
        setSubmitted("success");
      } else {
        setSubmitted("error");
      }
    } catch {
      setSubmitted("error");
    }
  };

  if (submitted === "success") {
    return (
      <div>
        <h2 className="text-2xl font-bold text-green-600 mb-4">Patient Registered Successfully!</h2>
        <div className="space-x-4">
          <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Return to Dashboard
          </button>
          <button onClick={() => navigate("/patients")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Go to Patient List
          </button>
        </div>
      </div>
    );
  }

  if (submitted === "error") {
    return (
      <div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">Registration Failed</h2>
        <div className="space-x-4">
          <button onClick={handleReset} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
            Try Again
          </button>
          <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xs">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">Register a new Patient.</h1>
        <p className="mt-2 text-[12px] text-blue-600">Enter Patient details.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {[
            { label: "Name", name: "name", required: true },
            { label: "Phone", name: "phone", required: true },
            { label: "Date of Birth", name: "dob", required: true },
            { label: "Sex", name: "sex", type: "select", required: true },
            { label: "Email", name: "email" },
            { label: "Address", name: "address" },
            { label: "Height (cm)", name: "height", type: "number" },
            { label: "Weight (kg)", name: "weight", type: "number" },
          ].map((field) => {
            const isInvalid = field.required && touched[field.name as keyof Patient] && !form[field.name as keyof Patient];
            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    name="sex"
                    value={form.sex}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`mt-1 block w-full rounded-md border ${
                      isInvalid ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={form[field.name as keyof Patient] ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`mt-1 block w-full rounded-md border ${
                      isInvalid ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                )}
                {isInvalid && <p className="text-xs text-red-500 mt-1">This field is required.</p>}
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            disabled={!isValid}
            className={`px-4 py-2 rounded text-white ${
              isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Register Patient
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}