
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function formatList(items) {
  return Array.isArray(items) ? items.join(", ") : "";
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export function downloadCSV(jobTitle, results = [], failed = []) {
  const headers = [
    "Candidate",
    "Filename",
    "Match Score (%)",
    "Matched Skills",
    "Missing Skills",
    "Detected Skills",
    "Additional Skills",
    "Strengths",
    "Assessment",
    "Error",
  ];

  const rows = [
    ...results.map((candidate) => [
      candidate.name,
      candidate.filename,
      candidate.match_score,
      formatList(candidate.matched_skills),
      formatList(candidate.missing_skills),
      formatList(candidate.detected_skills),
      formatList(candidate.additional_skills),
      formatList(candidate.strengths),
      candidate.overall_assessment,
      "",
    ]),
    ...failed.map((candidate) => [
      "",
      candidate.filename,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      candidate.error,
    ]),
  ];

  // Escape quotes and protect spreadsheet cells from formula injection.
  const escapeCell = (value) => {
    let text = String(value ?? "");

    if (/^[\s]*[=+\-@]/.test(text)) {
      text = `'${text}`;
    }

    return `"${text.replace(/"/g, '""')}"`;
  };

  const csv = [
    ["Job Title", jobTitle],
    [],
    headers,
    ...rows,
  ]
    .map((row) => row.map(escapeCell).join(","))
    .join("\r\n");

  downloadBlob(
    "\uFEFF" + csv,
    "talentlens-screening-results.csv",
    "text/csv;charset=utf-8;"
  );
}

export function downloadPDF(jobTitle, results = [], failed = []) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFontSize(20);
  pdf.text("TalentLens", 14, 18);

  pdf.setFontSize(11);
  pdf.text("Resume Screening Report", 14, 26);

  pdf.setFontSize(10);
  pdf.text(`Job Title: ${jobTitle || "Untitled Job"}`, 14, 35);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);
  pdf.text(
    `Resumes: ${results.length + failed.length} | Successful: ${results.length} | Failed: ${failed.length}`,
    14,
    49
  );

  autoTable(pdf, {
    startY: 56,
    head: [[
      "Candidate",
      "Score",
      "Matched Skills",
      "Missing Skills",
      "Assessment",
    ]],
    body: results.map((candidate) => [
      candidate.name || "Unknown Candidate",
      `${candidate.match_score ?? 0}%`,
      formatList(candidate.matched_skills) || "None",
      formatList(candidate.missing_skills) || "None",
      candidate.overall_assessment || "No assessment available",
    ]),
    theme: "grid",
    tableWidth: "auto",
styles: {
  font: "helvetica",
  fontSize: 7,
  cellPadding: 2.5,
  overflow: "linebreak",
  valign: "top",
  halign: "left",
  lineColor: [220, 220, 220],
  lineWidth: 0.1,
},
    headStyles: {
      fillColor: [35, 105, 75],
      textColor: 255,
      fontStyle: "bold",
      valign: "middle",
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 14, halign: "center" },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
      4: { cellWidth: "auto" },
    },
    margin: { left: 14, right: 14, bottom: 15 },
    rowPageBreak: "avoid",
    showHead: "everyPage",
  });

  if (failed.length) {
    const finalY = pdf.lastAutoTable?.finalY ?? 56;
    let y = finalY + 10;

    if (y > 260) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFontSize(12);
    pdf.text("Failed Resumes", 14, y);
    y += 7;

    pdf.setFontSize(9);

    failed.forEach((item) => {
      const lines = pdf.splitTextToSize(
        `${item.filename || "Unknown file"}: ${item.error || "Analysis failed"}`,
        pageWidth - 28
      );

      if (y + lines.length * 5 > 280) {
        pdf.addPage();
        y = 20;
      }

      pdf.text(lines, 14, y);
      y += lines.length * 5 + 3;
    });
  }

  pdf.save("talentlens-screening-report.pdf");
}
