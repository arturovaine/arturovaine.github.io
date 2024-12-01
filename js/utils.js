function generateContent(contentData) {
  let html = "";
  Object.keys(contentData).forEach((sectionKey) => {
    const section = contentData[sectionKey];
    if (section.title) {
      html += `<div class="content" id="${sectionKey}">`;
      html += `<h2>${section.title}</h2>`;
      if (section.items && section.items.length) {
        section.items.forEach((item) => {
          html += `<h3>${item.title}</h3><br>`;
          html += `<p>${item.description}</p>`;
          html += item.link ? `<a href="${item.link}" target="_blank">Learn more</a><br><br>` : "";

        });
      }
      html += `</div>`;
    }
  });
  return html;
}
