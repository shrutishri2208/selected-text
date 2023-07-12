const wordInput = document.getElementById("wordInput");
const translatedText = document.getElementById("translatedText");

const definition = document.getElementById("definition");
const synonyms = document.getElementById("synonyms");
const antonyms = document.getElementById("antonyms");
const partOfSpeech = document.getElementById("partOfSpeech");
const pronunciation = document.getElementById("pronunciation");
const examples = document.getElementById("examples");

const checkbox = document.querySelectorAll(".checkbox");

const errorLine = document.getElementById("error");

// const langSelect = document.getElementById("langSelect");

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

wordInput.addEventListener("input", () => {
  wordInput.style.height = "auto";
  let scrollHeight = wordInput.scrollHeight;
  if (scrollHeight > wordInput.clientHeight) {
    wordInput.style.height = scrollHeight + "px";
  }
});
translatedText.addEventListener("input", () => {
  wordInput.style.height = "auto";
  let scrollHeight = wordInput.scrollHeight;
  if (scrollHeight > wordInput.clientHeight) {
    wordInput.style.height = scrollHeight + "px";
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

langSelect.addEventListener("change", () => {
  getSelectedData().then((selectedData) => {
    wordInput.value = selectedData;
    getTranslatedText(selectedData, langSelect.value);
  });
});

getSelectedData().then((selectedData) => {
  wordInput.value = selectedData;
  const noOFWords = selectedData.trim().split(/\s+/);
  if (noOFWords.length === 1) {
    getWordDetails(selectedData);
    getOpposites(selectedData);
    getExamples(selectedData);
  } else {
    checkbox.forEach((item) => (item.disabled = true));
    definition.innerText = "";
    synonyms.innerText = "";
    antonyms.innerText = "";
  }
});

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
      if (!response.ok) {
        if (response.status === 429)
          errorLine.innerText = "Wait for some time! The server is busy :(";
      } else {
        displayDef(result);
        displaySyn(result);
        displayPart(result);
        displayPro(result);
      }
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
      if (!response.ok) {
        if (response.status === 429)
          errorLine.innerText = "Wait for some time! The server is busy :(";
      } else {
        displayAnt(result);
      }
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
      if (!response.ok) {
        if (response.status === 429)
          errorLine.innerText = "Wait for some time! The server is busy :(";
      } else {
        displayExa(result);
      }
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

const getTranslatedText = (selectedData, langSelect) => {
  const url = "https://google-translate105.p.rapidapi.com/v1/rapid/translate";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": "89209a214bmshb6c942f8ebdcd81p1deba7jsnf758971b30de",
      "X-RapidAPI-Host": "google-translate105.p.rapidapi.com",
    },
    body: new URLSearchParams({
      text: selectedData,
      to_lang: langSelect,
      from_lang: "en",
    }),
  };

  (async () => {
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 429)
          translatedText.value = "Wait for some time! The server is busy :(";
        getTranslatedText2(selectedData, langSelect);
      } else {
        translatedText.value = result.translated_text;
      }
    } catch (error) {
      console.error(error);
    }
  })();
};

const getTranslatedText2 = (selectedData, langSelect) => {
  const url = "https://google-translate105.p.rapidapi.com/v1/rapid/translate";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": "6624c4b9cdmsh7534e3ca67f64ddp18e5e9jsn2a8c6588663e",
      "X-RapidAPI-Host": "google-translate105.p.rapidapi.com",
    },
    body: new URLSearchParams({
      text: "hello",
      to_lang: "ar",
      from_lang: "en",
    }),
  };

  (async () => {
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 429)
          translatedText.value = "Wait for some time! The server is busy :(";
      } else {
        translatedText.value = result.translated_text;
      }
    } catch (error) {
      console.error(error);
    }
  })();
};
