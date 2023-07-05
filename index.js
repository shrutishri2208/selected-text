const input = document.getElementById("input");
const translatedText = document.getElementById("translated-text");

const definition = document.getElementById("definition");
const synonyms = document.getElementById("synonyms");
const antonyms = document.getElementById("antonyms");
const partOfSpeech = document.getElementById("partOfSpeech");
const pronunciation = document.getElementById("pronunciation");
const examples = document.getElementById("examples");

const checkbox = document.querySelectorAll(".checkbox");

let isActive = {
  1: true,
  2: true,
  3: true,
  4: false,
  5: false,
  6: false,
};

checkbox.forEach((box, index) =>
  box.addEventListener("change", () => {
    isActive[index + 1] = !isActive[index + 1];
    switch (index) {
      case 0:
        displayDef();
        break;
      case 1:
        displaySyn();
        break;
      case 2:
        displayAnt();
        break;
      case 3:
        displayPart();
        break;
      case 4:
        displayPro();
        break;
      case 5:
        displayExa();
        break;
    }
  })
);

input.addEventListener("input", () => {
  input.style.height = "auto";
  let scrollHeight = input.scrollHeight;
  if (scrollHeight > input.clientHeight) {
    input.style.height = scrollHeight + "px";
  }
});

const getSelectedData = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("selectedData", (result) => {
      if (!chrome.runtime.lastError) {
        resolve(result.selectedData);
      }
    });
  });
};
getSelectedData().then((selectedData) => {
  input.value = selectedData;
  getWordDetails(selectedData);
  getOpposites(selectedData);
  getExamples(selectedData);
});

const getTranslatedText = (selectedData) => {
  const url = "https://google-translate1.p.rapidapi.com/language/translate/v2";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "application/gzip",
      "X-RapidAPI-Key": "6624c4b9cdmsh7534e3ca67f64ddp18e5e9jsn2a8c6588663e",
      "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
    },
    body: new URLSearchParams({
      q: selectedData,
      target: "hi",
      source: "en",
    }),
  };

  (async () => {
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      translatedText.innerText = result.data.translations[0].translatedText;
    } catch (error) {
      console.error(error);
    }
  })();
};

const getWordDetails = (selectedData) => {
  word = selectedData.trim();

  const url = `https://wordsapiv1.p.rapidapi.com/words/${word}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "89209a214bmshb6c942f8ebdcd81p1deba7jsnf758971b30de",
      "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
    },
  };

  (async () => {
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      displayDef(result);
      displaySyn(result);
      displayPart(result);
      displayPro(result);
    } catch (error) {
      console.error(error);
    }
  })();
};

const getOpposites = (selectedData) => {
  word = selectedData.trim();

  const url = `https://wordsapiv1.p.rapidapi.com/words/${word}/antonyms`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "89209a214bmshb6c942f8ebdcd81p1deba7jsnf758971b30de",
      "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
    },
  };

  (async () => {
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      displayAnt(result);
    } catch (error) {
      console.error(error);
    }
  })();
};

const getExamples = (selectedData) => {
  word = selectedData.trim();

  const url = `https://wordsapiv1.p.rapidapi.com/words/${word}/examples`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "89209a214bmshb6c942f8ebdcd81p1deba7jsnf758971b30de",
      "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
    },
  };

  (async () => {
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      displayExa(result);
    } catch (error) {
      console.error(error);
    }
  })();
};

const displayDef = (result) => {
  if (isActive[1] === true) {
    definition.style.display = "block";
    definition.innerHTML = `<span>DEFINITION: </span> ${result.results[0].definition}`;
  } else {
    definition.style.display = "none";
  }
};
const displaySyn = (result) => {
  if (isActive[2] === true) {
    synonyms.style.display = "block";
    synonyms.innerHTML = `<span>SYNONYMS: </span> ${result.results[0].synonyms[0]}, ${result.results[0].synonyms[1]}`;
  } else {
    synonyms.style.display = "none";
  }
};
const displayAnt = (result) => {
  if (isActive[3] === true) {
    antonyms.style.display = "block";
    antonyms.innerHTML = `<span>ANTONYMS: </span> ${result.antonyms[0]}, ${result.antonyms[1]}`;
  } else {
    antonyms.style.display = "none";
  }
};
const displayPart = (result) => {
  if (isActive[4] === true) {
    partOfSpeech.style.display = "block";
    partOfSpeech.innerHTML = `<span>PART OF SPEECH: </span> ${result.results[0].partOfSpeech}`;
  } else {
    partOfSpeech.style.display = "none";
    partOfSpeech.innerHTML = `<span>PART OF SPEECH: </span> ${result.results[0].partOfSpeech}`;
  }
};
const displayPro = (result) => {
  if (isActive[5] === true) {
    pronunciation.style.display = "block";
    pronunciation.innerHTML = `<span>PRONUNCIATION: </span> ${result.pronunciation.all}`;
  } else {
    pronunciation.style.display = "none";
    pronunciation.innerHTML = `<span>PRONUNCIATION: </span> ${result.pronunciation.all}`;
  }
};
const displayExa = (result) => {
  if (isActive[6] === true) {
    examples.style.display = "block";
    examples.innerHTML = `<span>EXAMPLES OF USAGE: </span> ${result.examples[0]}, ${result.examples[1]}`;
  } else {
    examples.style.display = "none";
    examples.innerHTML = `<span>EXAMPLES OF USAGE: </span> ${result.examples[0]}, ${result.examples[1]}`;
  }
};

// displayPart();
// displayPro();
// displayExa();
