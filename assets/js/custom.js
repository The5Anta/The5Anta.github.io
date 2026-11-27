document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact .php-email-form");

  if (form) {
    const submitButton = document.querySelector("#contact-submit");
    const clearButton = document.querySelector("#contact-clear");
    const phoneField = document.querySelector("#contact-phone");
    const result = document.querySelector("#contact-result");
    const requiredFields = [...form.querySelectorAll("[required]")];
    const touchedFields = new Set();

    const formatLithuanianPhone = (value) => {
      let digits = value.replace(/\D/g, "");

      if (digits.startsWith("370")) {
        digits = digits.slice(3);
      }

      digits = digits.slice(0, 8);
      if (digits.length === 0) return "";
      if (digits.length <= 3) return `+370 ${digits}`;
      return `+370 ${digits.slice(0, 3)} ${digits.slice(3)}`;
    };

    const getFieldError = (field) => {
      const value = field.value.trim();
      if (field.required && value === "") {
        return "Šis laukas yra privalomas.";
      }
      if (field.name === "name" || field.name === "surname") {
        const lettersOnly = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]+$/u;
        if (!lettersOnly.test(value)) return "Galima įvesti tik raides.";
      }
      if (field.type === "email") {
        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailFormat.test(value) || !field.checkValidity()) {
          return "Įveskite tinkamo formato el. paštą.";
        }
      }
      if (field.type === "number") {
        const numberValue = Number(value);
        if (!Number.isInteger(numberValue) || numberValue < 1 || numberValue > 10) {
          return "Įvertinimas turi būti sveikasis skaičius nuo 1 iki 10.";
        }
      }
      if (field.name === "phone") {
        if (!/^\+370 [0-9]{3} [0-9]{5}$/.test(value)) {
          return "Numerio formatas: +370 6xx xxxxx.";
        }
      }
      return "";
    };

    const validateField = (field, showError = true) => {
      const error = getFieldError(field);
      const errorElement = document.querySelector(`#${field.id}-error`);

      if (showError && (touchedFields.has(field) || field.value.trim() !== "")) {
        field.classList.toggle("is-invalid", error !== "");
        field.setAttribute("aria-invalid", error !== "" ? "true" : "false");
        if (errorElement) errorElement.textContent = error;
      } else {
        field.classList.remove("is-invalid");
        field.setAttribute("aria-invalid", "false");
        if (errorElement) errorElement.textContent = "";
      }
      return error === "";
    };

    const updateSubmitButton = () => {
      submitButton.disabled = !requiredFields.every((field) => validateField(field, true));
    };

    requiredFields.forEach((field) => {
      field.addEventListener("input", () => {
        touchedFields.add(field);
        if (field.name === "phone") {
          field.value = formatLithuanianPhone(field.value);
        }
        validateField(field);
        updateSubmitButton();
      });
      field.addEventListener("change", () => {
        touchedFields.add(field);
        validateField(field);
        updateSubmitButton();
      });
      field.addEventListener("blur", () => {
        touchedFields.add(field);
        validateField(field);
        updateSubmitButton();
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      updateSubmitButton();
      if (submitButton.disabled) return;

      const formData = new FormData(form);
      const ratingDesign = Number(formData.get("ratingDesign"));
      const ratingContent = Number(formData.get("ratingContent"));
      const ratingUsability = Number(formData.get("ratingUsability"));
      const average = ((ratingDesign + ratingContent + ratingUsability) / 3).toFixed(2);
      const formObject = {
        vardas: String(formData.get("name")).trim(),
        pavarde: String(formData.get("surname")).trim(),
        elPastas: String(formData.get("email")).trim(),
        telefonoNumeris: String(formData.get("phone")).trim(),
        adresas: String(formData.get("address")).trim(),
        vertinimai: { dizainas: ratingDesign, turinys: ratingContent, patogumas: ratingUsability },
        vidurkis: Number(average)
      };

      console.log(formObject);
      result.replaceChildren();

      const appendLine = (label, value, emphasized = false) => {
        const line = document.createElement("div");
        if (emphasized) {
          const strong = document.createElement("strong");
          strong.textContent = `${label}: ${value}`;
          line.appendChild(strong);
        } else {
          const labelElement = document.createElement("strong");
          labelElement.textContent = `${label}: `;
          line.append(labelElement, String(value));
        }
        result.appendChild(line);
      };

      appendLine("Vardas", formObject.vardas);
      appendLine("Pavardė", formObject.pavarde);
      appendLine("El. paštas", formObject.elPastas);
      appendLine("Telefono numeris", formObject.telefonoNumeris);
      appendLine("Adresas", formObject.adresas);
      appendLine("Dizaino įvertinimas", formObject.vertinimai.dizainas);
      appendLine("Turinio įvertinimas", formObject.vertinimai.turinys);
      appendLine("Patogumo įvertinimas", formObject.vertinimai.patogumas);
      appendLine(`${formObject.vardas} ${formObject.pavarde}`, average, true);
      result.classList.add("is-visible");
    });

    clearButton.addEventListener("click", () => {
      form.reset();
      touchedFields.clear();
      requiredFields.forEach((field) => {
        field.classList.remove("is-invalid");
        field.setAttribute("aria-invalid", "false");
        const errorElement = document.querySelector(`#${field.id}-error`);
        if (errorElement) errorElement.textContent = "";
      });
      phoneField.value = "";
      result.replaceChildren();
      result.classList.remove("is-visible");
      submitButton.disabled = true;
    });

    updateSubmitButton();
  }

  const skills = [
    { name: "PCB projektavimas", status: "Planuojama", xp: 30 },
    { name: "PLC valdymo sistemos", status: "Planuojama", xp: 40 },
    { name: "EMC bandymai", status: "Planuojama", xp: 40 },
    { name: "Analoginė ir skaitmeninė elektronika", status: "Mokomasi", xp: 50 },
    { name: "Jutiklių integracija", status: "Mokomasi", xp: 60 },
    { name: "Pramoninis IoT", status: "Mokomasi", xp: 40 },
    { name: "Elektroninių sistemų diagnostika", status: "Atlikta", xp: 60 },
    { name: "Elektroninių schemų skaitymas", status: "Atlikta", xp: 50 }
  ];

  const statusColumnClasses = {
    "Planuojama": "planned",
    "Mokomasi": "learning",
    "Atlikta": "completed"
  };
  const statusNames = ["Planuojama", "Mokomasi", "Atlikta"];
  const SKILL_STORAGE_KEY = "skill-progress-statuses";

  function restoreSkillStatuses() {
    try {
      const savedStatuses = JSON.parse(localStorage.getItem(SKILL_STORAGE_KEY));
      if (!savedStatuses || typeof savedStatuses !== "object") return;

      skills.forEach((skill) => {
        const savedStatus = savedStatuses[skill.name];
        if (statusNames.includes(savedStatus)) {
          skill.status = savedStatus;
        }
      });
    } catch (error) {
      console.warn("Nepavyko atkurti įgūdžių būsenų iš vietinės saugyklos.", error);
    }
  }

  function saveSkillStatuses() {
    const statuses = {};
    skills.forEach((skill) => {
      statuses[skill.name] = skill.status;
    });

    try {
      localStorage.setItem(SKILL_STORAGE_KEY, JSON.stringify(statuses));
    } catch (error) {
      console.warn("Nepavyko išsaugoti įgūdžių būsenų vietinėje saugykloje.", error);
    }
  }

  function calculateTotalXp() {
    return skills
      .filter((skill) => skill.status === "Atlikta")
      .reduce((sum, skill) => sum + skill.xp, 0);
  }

  function getLevelInfo(totalXp) {
    if (totalXp >= 300) {
      return { level: 4, rank: "Profesionalas", start: 300, next: null };
    }
    if (totalXp >= 150) {
      return { level: 3, rank: "Specialistas", start: 150, next: 300 };
    }
    if (totalXp >= 50) {
      return { level: 2, rank: "Praktikantas", start: 50, next: 150 };
    }
    return { level: 1, rank: "Pradedantysis", start: 0, next: 50 };
  }

  function updateProgress(totalXp) {
    const levelInfo = getLevelInfo(totalXp);
    const totalXpElement = document.querySelector("#skill-total-xp");
    const levelElement = document.querySelector("#skill-level");
    const rankElement = document.querySelector("#skill-rank");

    if (totalXpElement) totalXpElement.innerHTML = `${totalXp} <span>XP</span>`;
    if (levelElement) levelElement.innerHTML = `${levelInfo.level} <span>lygis</span>`;
    if (rankElement) rankElement.textContent = levelInfo.rank;

    const bar = document.querySelector("#skill-progress-bar");
    const track = document.querySelector("#skill-progress-track");
    const value = document.querySelector("#skill-progress-value");
    const range = document.querySelector("#skill-progress-range");
    const caption = document.querySelector("#skill-progress-caption");

    let progress;
    if (levelInfo.next === null) {
      progress = 100;
      if (range) range.textContent = "4 lygio maksimalus progresas";
      if (value) value.textContent = `${totalXp} XP`;
      if (caption) caption.textContent = "Pasiektas maksimalus lygis.";
    } else {
      progress = ((totalXp - levelInfo.start) / (levelInfo.next - levelInfo.start)) * 100;
      progress = Math.max(0, Math.min(100, progress));
      if (range) range.textContent = `Progresas nuo ${levelInfo.start} XP iki ${levelInfo.next} XP`;
      if (value) value.textContent = `${totalXp} / ${levelInfo.next} XP`;
      const remaining = Math.max(0, levelInfo.next - totalXp);
      if (caption) caption.textContent = `Iki sekancio lygio liko ${remaining} XP.`;
    }

    if (bar) bar.style.width = `${progress}%`;
    if (track) {
      track.setAttribute("aria-valuenow", progress.toFixed(0));
      track.setAttribute("aria-valuetext", `${progress.toFixed(0)} procentų`);
    }
  }

  function updateStatistics() {
    const completedCount = skills.filter((skill) => skill.status === "Atlikta").length;
    const totalCount = skills.length;
    const completedPercent = totalCount === 0
      ? 0
      : Math.round((completedCount / totalCount) * 100);

    document.querySelector("#skill-total-count").textContent = totalCount;
    document.querySelector("#skill-completed-count").textContent = completedCount;
    document.querySelector("#skill-completed-percent").textContent = `${completedPercent}%`;

    Object.entries(statusColumnClasses).forEach(([status, columnClass]) => {
      const column = document.querySelector(`.skill-column.${columnClass}`);
      if (column) {
        const count = skills.filter((skill) => skill.status === status).length;
        column.querySelector(".skill-count").textContent = count;
      }
    });
  }

  function renderSkillCards() {
    Object.values(statusColumnClasses).forEach((columnClass) => {
      const column = document.querySelector(`.skill-column.${columnClass}`);
      if (column) {
        column.querySelectorAll(".skill-card").forEach((card) => card.remove());
      }
    });

    skills.forEach((skill) => {
      const column = document.querySelector(`.skill-column.${statusColumnClasses[skill.status]}`);
      if (!column) return;

      const card = document.createElement("article");
      card.className = "skill-card";

      const heading = document.createElement("div");
      heading.className = "skill-card-heading";
      const title = document.createElement("h4");
      title.textContent = skill.name;
      const status = document.createElement("span");
      status.className = "skill-status";
      status.textContent = skill.status;
      heading.append(title, status);

      const xp = document.createElement("strong");
      xp.className = "skill-xp";
      xp.textContent = `+${skill.xp} XP`;

      const select = document.createElement("select");
      select.className = "skill-status-select";
      select.setAttribute("aria-label", `Keisti ${skill.name} būseną`);
      statusNames.forEach((statusName) => {
        const option = document.createElement("option");
        option.value = statusName;
        option.textContent = statusName;
        option.selected = skill.status === statusName;
        select.appendChild(option);
      });
      select.addEventListener("change", () => {
        skill.status = select.value;
        renderSkillCards();
        saveSkillStatuses();
        updateModule();
      });

      card.append(heading, xp, select);
      column.appendChild(card);
    });
  }

  function updateModule() {
    updateProgress(calculateTotalXp());
    updateStatistics();
  }

  if (document.querySelector(".skill-board")) {
    restoreSkillStatuses();
    renderSkillCards();
    updateModule();
  }
});
