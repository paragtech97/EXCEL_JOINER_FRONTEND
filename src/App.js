import { useState } from "react";

export default function App() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    setter(file);
    setSuccess(false);
  };

  const handleSubmit = async () => {
    if (!file1 || !file2) {
      alert("Please select both files.");
      return;
    }

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);

    console.log("Submitting files:", file1.name, file2.name); // 👈 Debug log

    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("https://excel-joiner-backend.onrender.com/join", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "joined_output.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setSuccess(true);
      } else {
        const errorText = await response.text();
        console.error("Join failed:", errorText);
        alert("❌ Failed to process files. Please check the input format.");
      }
    } catch (err) {
      console.error("Error during file upload:", err);
      alert("⚠️ Error occurred during file processing.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3b0a45] via-[#e65250] to-[#e4e8e5] text-white flex items-center justify-center p-6">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-3xl max-w-3xl w-full p-12 space-y-8 text-center transform hover:scale-105 transition-all duration-300">
        <h1 className="text-5xl font-extrabold text-white tracking-wide flex justify-center items-center gap-2">
          <span className="text-pink-500">🔗</span> Excel Joiner Pro
        </h1>
        <p className="text-gray-300 mb-6 text-xl">Smart auto-matching with fuzzy joins, super fast!</p>

        <div className="grid sm:grid-cols-2 gap-8 text-left">
          <UploadCard
            title="Upload File 1"
            file={file1}
            onChange={(e) => handleFileChange(e, setFile1)}
            color="from-pink-500 to-purple-600"
          />
          <UploadCard
            title="Upload File 2"
            file={file2}
            onChange={(e) => handleFileChange(e, setFile2)}
            color="from-blue-500 to-teal-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !file1 || !file2}
          className={`mt-6 px-10 py-5 text-lg font-semibold rounded-3xl transition-all duration-300 shadow-xl
            ${loading || !file1 || !file2
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            }`}
        >
          {loading ? "Processing..." : "🚀 Join and Download"}
        </button>

        {success && (
          <p className="text-green-400 mt-3 font-semibold animate-pulse">
            ✅ File joined and downloaded!
          </p>
        )}

        <footer className="text-sm text-gray-400 pt-6 border-t border-gray-700">
          Built with ❤️ by Data Nerds · © 2025 Excel Joiner Pro
        </footer>
      </div>
    </div>
  );
}

function UploadCard({ title, file, onChange, color }) {
  return (
    <div className="bg-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-sm transition-transform transform hover:scale-105">
      <label className="block text-sm font-semibold text-gray-300 mb-2">{title}</label>
      <input
        type="file"
        accept=".xlsx"
        onChange={onChange}
        className={`block w-full text-sm text-white file:mr-4 file:py-3 file:px-5
        file:rounded-full file:border-0 file:text-sm file:font-semibold
        file:bg-gradient-to-r ${color} file:text-white hover:file:brightness-110 transition-all duration-300`}
      />
      {file && <p className="mt-2 text-sm text-gray-300">📄 {file.name}</p>}
    </div>
  );
}
