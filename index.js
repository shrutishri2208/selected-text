const input = document.getElementById("input");
const translatedText = document.getElementById("translated-text");

const definition = document.getElementById("definition");
const synonyms = document.getElementById("synonyms");
const opposites = document.getElementById("opposites");
const partOfSpeech = document.getElementById("partOfSpeech");
const pronunciation = document.getElementById("pronunciation");
const examples = document.getElementById("examples");

// const defCheck = document.getElementById("defCheck");
// const synCheck = document.getElementById("synCheck");
// const antCheck = document.getElementById("antCheck");
// const partCheck = document.getElementById("partCheck");
// const proCheck = document.getElementById("proCheck");
// const exaCheck = document.getElementById("exaCheck");

const checkbox = document.querySelectorAll(".checkbox");
// checkbox[0].addEventListener("change", () => {
//   console.log("CHANGED");
// });

let checkObj = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
};

checkbox.forEach((box, index) =>
  box.addEventListener("change", () => {
    console.log("CHANGED:", index);

    if (index === 0 || index === 1 || index === 3 || index === 4)
      checkObj[index + 1] = !checkObj[index + 1];
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
  console.log("TEXT:", selectedData);
  // getOpposites(selectedData);
  // getExamples(selectedData);
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
      console.log(result.data.translations[0].translatedText);
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

      if (checkObj[1] === true) console.log("DISPLAY");
      else console.log("DON'T");

      // if (checkObj[1] === true) {
      //   definition.innerText = "DEFINITION:" + result.results[0].definition;
      // } else {
      //   definition.innerText = "";
      // }

      partOfSpeech.innerText = result.results[0].partOfSpeech;
      synonyms.innerText = result.results[0].synonyms[0];
      // result.results[0].synonyms[1];
      pronunciation.innerText = result.pronunciation.all;
    } catch (error) {
      console.error(error);
    }
  })();
};

const getOpposites = (selectedData) => {
  word = selectedData.trim();

  const url = `https://wordsapiv1.p.rapidapi.com/words/${word}/antonyms`;
  // const url = `https://wordsapiv1.p.rapidapi.com/words/${selectedData}/antonyms`;
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
      opposites.innerText = result.antonyms[0];
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
      examples.innerText = result.examples[0];
    } catch (error) {
      console.error(error);
    }
  })();
};
