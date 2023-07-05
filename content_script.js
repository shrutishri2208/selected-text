const getSelectedText = () => {
  var selectedText = window.getSelection().toString();

  chrome.runtime.sendMessage(selectedText);
};

document.addEventListener("mouseup", getSelectedText);
