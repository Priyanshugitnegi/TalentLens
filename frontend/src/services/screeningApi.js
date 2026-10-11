
const API_URL = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/screening/screen/`;
export async function screenResumes(jobTitle, jobDescription, files) {
  const formData = new FormData();

  formData.append("job_title", jobTitle);
  formData.append("job_description", jobDescription);

  files.forEach((file) => {
    formData.append("resumes", file);
  });

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Screening request failed.");
  }

  return data;
}
