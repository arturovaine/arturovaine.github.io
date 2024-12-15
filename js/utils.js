function generateContent(contentData) {
  let html = "";
  Object.keys(contentData).forEach((sectionKey) => {
    const section = contentData[sectionKey];
    if (section.title) {
      html += `<div class="content" id="${sectionKey}">`;
      html += `<br/><h2>${section.title}</h2>`;
      
      if (section.items && section.items.length) {
        section.items.forEach((item) => {
          html += `<h3>${item.title}</h3>`;
          // Render description with HTML tags explicitly
          html += `<p>${item.description}</p>`;
          
          // Image styles
          const imgStyle = sectionKey === "artworks"
            ? "display: block; margin: 0 auto; width: 300px; height: 300px; object-fit: contain; border-radius: 5px;"
            : "display: block; margin: 0 auto; width: 50%; object-fit: contain; border-radius: 5px;";

          // Render image if available
          if (item.image) {
            html += `<a href="${item.link || '#'}" target="_blank">
              <img src="${item.image}" style="${imgStyle}" />
            </a><br><br>`;
          }

          // Render smaller image if available
          if (item.image_sm) {
            html += `<a href="${item.link || '#'}" target="_blank">
              <img src="${item.image_sm}" style="display: block; margin: 0 auto; height: 65px; object-fit: contain;" />
            </a><br><br>`;
          }

          item.image_description
          ? html += `<p style="font-size: small;">${item.image_description}</p>`
          : ""

          // Add "Learn more" link if available
          if (item.link) {
            html += `<a href="${item.link}" target="_blank">Learn more</a><br><br>`;
          }
        });
      }
      html += `</div>`;
    }
  });
  return html;
}
