const getSelectedText = () => {
  var selectedText = window.getSelection().toString();

  chrome.runtime.sendMessage(selectedText);
  console.log("CONTENT:", selectedText);
};

document.addEventListener("mouseup", getSelectedText);
