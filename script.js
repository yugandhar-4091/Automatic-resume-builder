const form = document.getElementById("resumeForm");
const resumePreview = document.getElementById("resumePreview");
const clearBtn = document.getElementById("clearBtn");
const nameInput = document.getElementById("name");
const formContainer = document.querySelector(".form-container");

/* Update watermark with name */
function updateWatermark() {
  const wm = nameInput.value.trim() || "Yugandhar";
  formContainer.setAttribute("data-watermark", wm);
}
nameInput.addEventListener("input", updateWatermark);
updateWatermark();

/* Generate Resume Preview */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    linkedin: document.getElementById("linkedin").value.trim(),
    github: document.getElementById("github").value.trim(),
    summary: document.getElementById("summary").value.trim(),
    skills: document.getElementById("skills").value.split(",").map(s => s.trim()).filter(Boolean),
    education: document.getElementById("education").value.trim(),
    experience: document.getElementById("experience").value.trim(),
    projects: document.getElementById("projects").value.split("\n").map(p => p.trim()).filter(Boolean),
    certs: document.getElementById("certs").value.split("\n").map(c => c.trim()).filter(Boolean)
  };

  const links = [
    data.linkedin ? `<a href="${safeUrl(data.linkedin)}" target="_blank">LinkedIn</a>` : "",
    data.github ? `<a href="${safeUrl(data.github)}" target="_blank">GitHub</a>` : ""
  ].filter(Boolean).join(" | ");

  resumePreview.innerHTML = `
    <div class="resume-header">
      <h1>${escapeHTML(data.name) || "Your Name"}</h1>
      <div class="meta">
        ${escapeHTML(data.email)} ${data.phone ? " | " + escapeHTML(data.phone) : ""} ${links ? " | " + links : ""}
      </div>
    </div>

    <section class="section">
      <h3>Professional Summary</h3>
      <p>${nl2br(escapeHTML(data.summary))}</p>
    </section>

    <section class="section">
      <h3>Skills</h3>
      <ul>${data.skills.map(s => `<li>${escapeHTML(s)}</li>`).join("")}</ul>
    </section>

    <section class="section">
      <h3>Education</h3>
      <p>${nl2br(escapeHTML(data.education))}</p>
    </section>

    <section class="section">
      <h3>Experience</h3>
      <p>${nl2br(escapeHTML(data.experience))}</p>
    </section>

    <section class="section">
      <h3>Projects</h3>
      <ul>${data.projects.map(p => `<li>${escapeHTML(p)}</li>`).join("")}</ul>
    </section>

    <section class="section">
      <h3>Certifications</h3>
      <ul>${data.certs.map(c => `<li>${escapeHTML(c)}</li>`).join("")}</ul>
    </section>
  `;
});

/* Download PDF */
function downloadPDF() {
  if (!resumePreview.innerText.trim()) {
    alert("Please generate your resume first.");
    return;
  }
  const opt = {
    margin: 0.5,
    filename: "resume.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };
  html2pdf().from(resumePreview).set(opt).save();
}

/* Clear form */
clearBtn.addEventListener("click", () => {
  form.reset();
  resumePreview.innerHTML = `<p class="placeholder">Fill the form and click “Generate Resume” to see a preview here.</p>`;
  updateWatermark();
});

/* Helpers */
function nl2br(str) {
  return (str || "").replace(/\n/g, "<br>");
}
function escapeHTML(str = "") {
  return str.replace(/[&<>"']/g, s => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[s]));
}
function safeUrl(url = "") {
  try { return new URL(url).href; } catch { return "#"; }
}

window.downloadPDF = downloadPDF;
/* Download as PDF */
function downloadPDF() {
  if (!resumePreview.innerText.trim()) {
    alert("Please generate your resume first.");
    return;
  }
  const opt = {
    margin: 0.5,
    filename: "resume.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };
  html2pdf().from(resumePreview).set(opt).save();
}

/* Download as PNG */
function downloadPNG() {
  if (!resumePreview.innerText.trim()) {
    alert("Please generate your resume first.");
    return;
  }
  html2canvas(resumePreview, { scale: 2 }).then(canvas => {
    const link = document.createElement("a");
    link.download = "resume.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

/* Download as DOCX */
function downloadDOCX() {
  if (!resumePreview.innerText.trim()) {
    alert("Please generate your resume first.");
    return;
  }

  const content = resumePreview.innerText; // plain text (ATS safe)
  const blob = new Blob(
    [`<html><body><pre>${content}</pre></body></html>`],
    { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
  );
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "resume.docx";
  link.click();
}

