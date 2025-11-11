function generateContent(contentData) {
  let html = "";
  Object.keys(contentData).forEach((sectionKey) => {
    const section = contentData[sectionKey];
    if (section.title) {
      html += `<div class="content" id="${sectionKey}">`;
      // html += `<h2>${section.title}</h2>`;
      if (section.items && section.items.length) {
        section.items.forEach((item) => {
          // html += `<p>teste!!!!</p>`;
          html += `<h3>${item.title}</h3>`;
          html += `<p>${item.description}</p>`;
          html += item.link ? `<a href="${item.link}" target="_blank">Learn more</a><br><br>` : "";
          // Apply specific style for the artworks section
          const imgStyle = sectionKey === "artworks" 
          ? "display: block; margin: 0 auto; height: 300px; object-fit: contain; border-radius: 10px;" 
          : "display: block; margin: 0 auto; height: 100px; object-fit: contain;";
          html += item.image ? `<a href="${item.link}" target="_blank"><img src="${item.image}" style="${imgStyle}" /></a><br><br>` : "";
        });
      }
      html += `</div>`;
    }
  });
  return html;
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("../data.json")
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
