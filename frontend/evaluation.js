const evaluationData = [
  {
    sectionId: "dsa",
    sectionLabel: "DSA",
    skills: [
      {
        skillId: "dsa_problem_decomposition",
        score: "6 / 10",
        evidence: "Explained the approach by breaking the problem into input parsing, core logic, and edge-case handling.",
        code: "Used helper function to separate preprocessing from main logic.",
        uncertainty: "Edge-case handling was described verbally but not fully reflected in code."
      },
      {
        skillId: "dsa_complexity_awareness",
        score: "6 / 10",
        evidence: "Stated O(n) time and O(1) space complexity.",
        code: "Single-pass traversal with constant extra variables.",
        uncertainty: "Complexity justification was informal."
      }
    ]
  },
  {
    sectionId: "debugging",
    sectionLabel: "Debugging",
    skills: [
      {
        skillId: "debug_error_identification",
        score: "5 / 10",
        evidence: "Identified off-by-one error causing incorrect output.",
        code: "Adjusted loop boundary condition.",
        uncertainty: "Debugging focused on observed failure only."
      }
    ]
  },
  {
    sectionId: "system_design",
    sectionLabel: "System Design",
    skills: [
      {
        skillId: "sys_design_component_identification",
        score: "6 / 10",
        evidence: "Outlined API layer, service logic, and database.",
        code: "API → Service → Storage",
        uncertainty: "Trade-offs were mentioned briefly."
      }
    ]
  }
];

const container = document.getElementById("sections");

evaluationData.forEach(section => {
  const sectionEl = document.createElement("div");
  sectionEl.className = "section";
  sectionEl.innerHTML = `<h2>${section.sectionLabel}</h2>`;

  section.skills.forEach(skill => {
    const skillEl = document.createElement("div");
    skillEl.className = "skill";
    skillEl.innerHTML = `
      <div class="skill-header">
        <span>${skill.skillId}</span>
        <span class="score">${skill.score}</span>
      </div>
      <div class="evidence"><strong>Evidence:</strong> ${skill.evidence}</div>
      <div class="code-ref"><strong>Code Reference:</strong> ${skill.code}</div>
      <div class="uncertainty"><strong>Uncertainty:</strong> ${skill.uncertainty}</div>
    `;
    sectionEl.appendChild(skillEl);
  });

  container.appendChild(sectionEl);
});
