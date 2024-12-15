
document.addEventListener("DOMContentLoaded", () => {
  fetch("./data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load data.json");
      }
      return response.json();
    })
    .then((data) => {
      const root = document.getElementById("rootContent");
      root.innerHTML = generateContent(data.content); // Function from utils.js
    })
    .catch((error) => console.error("Error loading JSON:", error));
});
