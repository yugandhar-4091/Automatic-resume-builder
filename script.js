const form = document.getElementById("resumeForm");
const resumePreview = document.getElementById("resumePreview");

// Generate Resume
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    linkedin: document.getElementById("linkedin").value,
    github: document.getElementById("github").value,
    summary: document.getElementById("summary").value,
    skills: document.getElementById("skills").value.split(","),
    education: document.getElementById("education").value,
    experience: document.getElementById("experience").value,
    projects: document.getElementById("projects").value.split("\n"),
    certs: document.getElementById("certs").value.split("\n")
  };

  resumePreview.innerHTML = `
    <div class="resume-template">
      <header>
        <h1>${data.name}</h1>
        <p>${data.email} | ${data.phone}</p>
        <p>
          ${data.linkedin ? `<a href="${data.linkedin}" target="_blank">LinkedIn</a>` : ""}
          ${data.github ? ` | <a href="${data.github}" target="_blank">GitHub</a>` : ""}
        </p>
      </header>

      <section>
        <h2>Professional Summary</h2>
        <p>${data.summary}</p>
      </section>

      <section>
        <h2>Skills</h2>
        <ul>${data.skills.map(skill => `<li>${skill.trim()}</li>`).join("")}</ul>
      </section>

      <section>
        <h2>Education</h2>
        <p>${data.education.replace(/\n/g, "<br>")}</p>
      </section>

      <section>
        <h2>Experience</h2>
        <p>${data.experience.replace(/\n/g, "<br>")}</p>
      </section>

      <section>
        <h2>Projects</h2>
        <ul>${data.projects.map(p => `<li>${p}</li>`).join("")}</ul>
      </section>

      <section>
        <h2>Certifications</h2>
        <ul>${data.certs.map(c => `<li>${c}</li>`).join("")}</ul>
      </section>
    </div>
  `;
});

// PDF Download
function downloadPDF() {
  const element = document.getElementById("resumePreview");
  if (!element || element.innerHTML.trim() === "") {
    alert("⚠ Please generate your resume before downloading!");
    return;
  }

  const opt = {
    margin: 0.5,
    filename: "resume.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };

  html2pdf().from(element).set(opt).save();
}
