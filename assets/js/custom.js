document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact .php-email-form");

  if (!form) {
    return;
  }

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

    if (digits.length === 0) {
      return "";
    }
    if (digits.length <= 3) {
      return `+370 ${digits}`;
    }
    return `+370 ${digits.slice(0, 3)} ${digits.slice(3)}`;
  };

  const getFieldError = (field) => {
    const value = field.value.trim();

    if (field.required && value === "") {
      return "Šis laukas yra privalomas.";
    }

    if (field.name === "name" || field.name === "surname") {
      const lettersOnly = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]+$/u;
      if (!lettersOnly.test(value)) {
        return "Galima įvesti tik raides.";
      }
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
      if (errorElement) {
        errorElement.textContent = error;
      }
    } else {
      field.classList.remove("is-invalid");
      field.setAttribute("aria-invalid", "false");
      if (errorElement) {
        errorElement.textContent = "";
      }
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

    if (submitButton.disabled) {
      return;
    }

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
      vertinimai: {
        dizainas: ratingDesign,
        turinys: ratingContent,
        patogumas: ratingUsability
      },
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
      if (errorElement) {
        errorElement.textContent = "";
      }
    });

    phoneField.value = "";
    result.replaceChildren();
    result.classList.remove("is-visible");
    submitButton.disabled = true;
  });

  updateSubmitButton();
});
