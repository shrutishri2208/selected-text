// const getSelectedText = () => {
//   chrome.storage.local.get("selectedData", (result) => {
//     selectedText = result.selectedData;
//     console.log("INDEX INSIDE:", selectedText);

//     return selectedText;
//   });
// };

// selectedText = getSelectedText();

chrome.storage.local.get("selectedData", function (result) {
  var selectedData = result.selectedData;
  console.log("INDEX: ", selectedData);

  const title = document.getElementById("title");

  title.innerText = selectedData;
});
