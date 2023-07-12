// const translate = require("./bundle");

import translate from "./google-translate-api/index.js";

translate("Ik spreek Engels", { to: "en" })
  .then((res) => {
    console.log(res.text);
    //=> I speak Englishs
    console.log(res.from.language.iso);
    //=> nl
  })
  .catch((err) => {
    console.error(err);
  });
