let passwordStrength = document.querySelector("#strength");
const charSlider = document.querySelector(".slider");
const slideNumber = document.querySelector("#number");
const checkBoxes = document.querySelectorAll(".choice");
let passwordBtn = document.querySelector("#generate");
const indicators = Array.from(document.querySelectorAll(".indicator"));
const passwordField = document.querySelector("#password-field");
const copyBtn = document.querySelector(".copy-btn");
const copiedText = document.querySelector(".copied-text");
let passwordLength = Number(charSlider.value);
passwordBtn.disabled = true;
let isChecked;

const CHARACTER_SETS = {
  uppercase: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ"],
  lowercase: ["abcdefghijklmnopqrstuvwxyz"],
  numbers: ["1234567890"],
  symbols: ["!@#$%^&*()"],
};

const newPassword = {
  chosen: [],
  password: "",
  uppercase: false,
  lowercase: false,
  numbers: false,
  symbols: false,
  score: 0,
  strength: "",
};

const styleCharSlider = () => {
  const min = charSlider.min;
  const max = charSlider.max;
  const val = charSlider.value;

  charSlider.style.backgroundSize = ((val - min) * 99) / (max - min) + "% 100%";
};

const getSliderValue = () => {
  return charSlider.value;
};

const handleSlider = (e) => {
  styleCharSlider();
  slideNumber.textContent = getSliderValue();
  passwordLength = Number(e.target.value);
  // passwordLengthEl.textContent = passwordLength;
};

// shuffle letters in array
const shuffle = (array) => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

const getCharacters = () => {
  // reset strength score
  newPassword.score = 0;
  newPassword.chosen = [];

  checkBoxes.forEach((choice) => {
    if (choice.checked) {
      newPassword[choice.name] = true;
      newPassword.chosen.push(...CHARACTER_SETS[choice.name][0]);
    }
  });
};

const createPassword = () => {
  isChecked = Array.from(checkBoxes).some((box) => box.checked);
  // check if any of the checkboxes are currently checked and update the status of the password button accordingly
  isChecked ? (passwordBtn.disabled = false) : (passwordBtn.disabled = true);
  if (!isChecked) return;
  getCharacters();
  newPassword.password = "";
  passwordBtn.value = "";
  newPassword.chosen = shuffle(newPassword.chosen);
  // copyBtn.style.opacity = 1;
  for (let i = 0; i < passwordLength; i++) {
    const chosenIndex = Math.floor(Math.random() * newPassword.chosen.length);
    // const chosenOption = newPassword.chosen[chosenIndex];
    // const charIndex = Math.floor(Math.random() * chosenOption[1]);
    const char = newPassword.chosen[chosenIndex];
    newPassword.password += char;
    // console.log(newPassword.chosen);
  }
  passwordField.value = newPassword.password;
  // return newPassword;
};

const scorePassword = () => {
  // score options chosen
  if (newPassword.uppercase) {
    newPassword.score += 15;
  }
  if (newPassword.lowercase) {
    newPassword.score += 15;
  }
  if (newPassword.numbers) {
    newPassword.score += 15;
  }
  if (newPassword.symbols) {
    newPassword.score += 15;
  }

  // score password length
  if (passwordLength <= 5) {
    newPassword.score += 10;
  }
  if (passwordLength > 5 && passwordLength <= 10) {
    newPassword.score += 20;
  }
  if (passwordLength > 10 && passwordLength <= 15) {
    newPassword.score += 30;
  }
  if (passwordLength > 15) {
    newPassword.score += 40;
  }

  assignPasswordStrength();
};

const assignPasswordStrength = () => {
  if (newPassword.score < 40) {
    newPassword.strength = "VERY WEAK!";
    newPassword.rating = 1;
  } else if (newPassword.score < 51) {
    newPassword.strength = "WEAK";
    newPassword.rating = 2;
  } else if (newPassword.score < 81) {
    newPassword.strength = "MEDIUM";
    newPassword.rating = 3;
  } else {
    newPassword.strength = "STRONG";
    newPassword.rating = 4;
  }
  passwordStrength.textContent = newPassword.strength;
  fillBarColours();
};

const resetBarColours = () => {
  indicators.forEach((bar) => {
    bar.style.backgroundColor = "transparent";
    bar.style.borderColor = "hsl(252, 11%, 91%)";
  });
};

const fillBarColours = () => {
  const fillBars = indicators.slice(0, newPassword.rating);
  resetBarColours();
  let colour;
  if (newPassword.rating === 1) {
    colour = "hsl(0, 91%, 63%)";
  } else if (newPassword.rating === 2) {
    colour = "hsl(13, 95%, 66%)";
  } else if (newPassword.rating === 3) {
    colour = "hsl(42, 91%, 68%)";
  } else if (newPassword.rating === 4) {
    colour = "hsl(127, 100%, 82%";
  }
  fillBars.forEach((bar) => {
    bar.style.backgroundColor = colour;
    bar.style.borderColor = colour;
  });
};

const showCopySuccess = () => {
  console.log("Successfully copied...");
  copiedText.textContent = "COPIED!";
  // Fade out text after 1 second

  setTimeout(() => {
    copiedText.textContent = "";
  }, 1500);
};

// EVENT LISTENERS
charSlider.addEventListener("input", handleSlider);
passwordBtn.addEventListener("click", createPassword);
passwordBtn.addEventListener("click", scorePassword);
// monitor if any of the checkboxes have been ticked / checked
document.addEventListener("input", (e) => {
  isChecked = Array.from(checkBoxes).some((box) => box.checked);
  if (e.target.nodeName !== "INPUT") return;
  // update status of checkbox that has been clicked
  if (e.target.checked) {
    newPassword[e.target.id] = true;
    passwordBtn.disabled = false;
  } else {
    newPassword[e.target.id] = false;
  }
  isChecked ? (passwordBtn.disabled = false) : (passwordBtn.disabled = true);
  if (!isChecked) {
    passwordField.value = "";
    passwordStrength.textContent = "";
    resetBarColours();
  }
});

copyBtn.addEventListener("click", () => {
  if (!passwordField.value) return;
  navigator.clipboard
    .writeText(passwordField.value)
    .then(() => showCopySuccess())
    .catch((error) => console.log("Could not copy:", error));
});
