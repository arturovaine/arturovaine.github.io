function generateContent(contentData) {
  let html = "";

  Object.keys(contentData).forEach((sectionKey) => {
    const section = contentData[sectionKey];

    if (section.title) {
      html += `<div class="content" id="${sectionKey}">`;
      html += `<br/><h2>${section.title}</h2>`;

      if (section.items && section.items.length) {
        section.items.forEach((item) => {
          // Render title and duration
          const duration = item.start_date
            ? `${formatDate(item.start_date)} - ${
                item.end_date ? formatDate(item.end_date) : "Present"
              } · ${calculateDuration(item.start_date, item.end_date)}`
            : "";

          html += `<h3>${item.title}</h3>`;
          if (duration) {
            html += `<p>${duration}</p>`;
          }

          // Render description
          html += `<p>${item.description}</p>`;

          // Render images
          const imgStyle = sectionKey === "artworks"
            ? "display: block; margin: 0 auto; width: 300px; object-fit: contain; border-radius: 5px;"
            : "display: block; margin: 0 auto; width: 50%; object-fit: contain; border-radius: 5px;";
          if (item.image) {
            html += `<a href="${item.link || '#'}" target="_blank">
              <img src="${item.image}" style="${imgStyle}" />
            </a><br><br>`;
          }
          if (item.image_sm) {
            html += `<a href="${item.link || '#'}" target="_blank">
              <img src="${item.image_sm}" style="display: block; margin: 0 auto; height: 65px; object-fit: contain;" />
            </a><br><br>`;
          }

          // Render image description if available
          if (item.image_description) {
            html += `<p style="font-size: small;">${item.image_description}</p>`;
          }
        });
      }

      html += `</div>`;
    }
  });

  return html;
}

// Function to calculate dynamic duration
function calculateDuration(startDate, endDate = new Date()) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  let duration = "";
  if (years > 0) duration += `${years} yr${years > 1 ? "s" : ""} `;
  if (months > 0) duration += `${months} mo${months > 1 ? "s" : ""}`;
  return duration.trim();
}

// Function to format date (e.g., "Mar 2023")
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short" };
  return date.toLocaleDateString("en-US", options);
}
