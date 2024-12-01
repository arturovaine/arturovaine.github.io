function generateContent(contentData) {
  let html = "";
  Object.keys(contentData).forEach((sectionKey) => {
    const section = contentData[sectionKey];
    if (section.title) {
      html += `<div class="content" id="${sectionKey}">`;
      html += `<h2>${section.title}</h2>`;
      if (section.items && section.items.length) {
        section.items.forEach((item) => {
          html += `<h3>${item.title}</h3>`;
          html += `<p>${item.description}</p>`;
        });
      }
      html += `</div>`;
    }
  });
  return html;
}
