class ProjectCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "project-card");

    const title = this.getAttribute("title") || "Project Title";
    const description =
      this.getAttribute("description") || "Project description";
    const href = this.getAttribute("href") || "#";
    const image = this.getAttribute("image") || "";

    wrapper.innerHTML = `
    <link rel="stylesheet" href="../styles/projects-cards.css">
      <style>

      /* PORTFOLIO PROJECTS */

.portfolio__wrapper {
  max-width: 757px;
  margin: 0 auto;
  padding-bottom: 0;
}

.portfolio__grid {
  display: grid;
  gap: 48px 33px;
  grid-template-columns: 1fr 1fr;
}

.project-card {
  position: relative;
  overflow: hidden;
  border-radius: 15px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card {
  display: block;
  /* width: 100%; */
}

.project-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffe071e0;
  opacity: 1;
  transition: opacity 0.7s ease;
  pointer-events: none;
}

.project-card:hover::after {
  opacity: 0;
}

.project__thumbnail {
  display: block;
  margin: 0 auto;
  width: 362px;
  height: 226px;
  object-fit: cover;
  object-position: top left;
  border-radius: 15px;
}

.project-card--title {
  height: 33px;
  width: 80%;
  position: absolute;
  z-index: 1;
  opacity: 1;
  font-size: 24px;
  font-weight: 500;
  color: #3d3d3d;
  display: flex;
  margin: 0 auto;
  margin-top: 53px;
  align-items: center;
  justify-content: center;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s ease, color 0.7s ease;
}

.project-card:hover .project-card--title {
  opacity: 0;
}

.project-card--description {
  height: 42px;
  width: 287px;
  position: absolute;
  z-index: 1;
  opacity: 1;
  font-size: 14px;
  font-weight: 500;
  color: #3d3d3d;
  display: flex;
  margin: 0 auto;
  margin-top: 90px;
  align-items: center;
  justify-content: center;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s ease, color 0.7s ease;
}

.project-card:hover .project-card--description {
  opacity: 0;
}

.project-card--link-btn {
  position: absolute;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  z-index: 1;
  opacity: 1;
  background-color: #ffffff;
  border: none;
  display: flex;
  margin: 0 auto;
  margin-top: 150px;
  align-items: center;
  justify-content: center;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s ease, color 0.7s ease;
  pointer-events: none;
}

.project-card--link-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.project-card:hover .project-card--link-btn {
  opacity: 0;
}

        
.project-card {
  position: relative;
  overflow: hidden;
  border-radius: 15px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card {
  display: block;
  /* width: 100%; */
}

.project-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffe071e0;
  opacity: 1;
  transition: opacity 0.7s ease;
  pointer-events: none;
}

.project-card:hover::after {
  opacity: 0; 
}

.project__thumbnail {
  display: block;
  margin: 0 auto;
  width: 362px;
  height: 226px;
  object-fit: cover;
  object-position: top left;
  border-radius: 15px;
}

.project-card--title {
  height: 33px;
  width: 80%;
  position: absolute;
  z-index: 1;
  opacity: 1;
  font-size: 24px;
  font-weight: 500;
  color: #3d3d3d;
  display: flex;
  margin: 0 auto;
  margin-top: 53px;
  align-items: center;
  justify-content: center;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s ease, color 0.7s ease;
}

.project-card:hover .project-card--title {
  opacity: 0;
}

.project-card--description {
  height: 42px;
  width: 287px;
  position: absolute;
  z-index: 1;
  opacity: 1;
  font-size: 14px;
  font-weight: 500;
  color: #3d3d3d;
  display: flex;
  margin: 0 auto;
  margin-top: 90px;
  align-items: center;
  justify-content: center;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s ease, color 0.7s ease;
}

.project-card:hover .project-card--description {
  opacity: 0;
}

.project-card--link-btn {
  position: absolute;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  z-index: 1;
  opacity: 1;
  background-color: #ffffff;
  border: none;
  display: flex;
  margin: 0 auto;
  margin-top: 150px;
  align-items: center;
  justify-content: center;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s ease, color 0.7s ease;
  pointer-events: none;
}

.project-card--link-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.project-card:hover .project-card--link-btn {
  opacity: 0;
}
      </style>

      <div class="project-card">
      <a href="${href}" target="_blank">
        <div class="project-card--title">${title}</div>
        <div class="project-card--description">${description}</div>
        <button class="project-card--link-btn">
          <img src="./assets/icons/link-chain.svg" alt="Link icon" class="project-card--link-icon">
        </button>
        <img src="${image}" alt="${title}" class="project__thumbnail">
      </a>
      </div>
    `;

    shadow.appendChild(wrapper);
  }
}

customElements.define("project-card", ProjectCard);
