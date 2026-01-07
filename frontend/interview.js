const data = [
  {
    sectionId: "dsa",
    sectionLabel: "DSA",
    question: "Explain how you would find the second largest element in an array."
  },
  {
    sectionId: "debugging",
    sectionLabel: "Debugging",
    question: "How would you identify the root cause of a null pointer exception in production?"
  },
  {
    sectionId: "system_design",
    sectionLabel: "System Design",
    question: "Design a URL shortening service at a high level."
  }
];

let index = 0;

const sectionEl = document.getElementById("section");
const questionEl = document.getElementById("questionText");
const progressBar = document.getElementById("progressBar");
const nextBtn = document.getElementById("nextBtn");

nextBtn.addEventListener("click", () => {
  if (index < data.length - 1) {
    index++;
    sectionEl.textContent = data[index].sectionLabel;
    questionEl.textContent = data[index].question;
    progressBar.style.width = `${((index + 1) / data.length) * 100}%`;
  } else {
    nextBtn.textContent = "Interview Complete";
    nextBtn.disabled = true;
  }
});
