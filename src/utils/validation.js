const regexTest = ({ regex, str }) => regex.test(String(str));

export const isEmailValid = (email) =>
  regexTest({
    regex:
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    str: email,
  });

export const isUsernameValid = [
  { type: "start", regex: /^(?![. ])/ },
  { type: "end", regex: /(?<![.])$/ },
  { type: "oneDotInRow", regex: /^(?!.*[.]{2})/ },
  { type: "onlyAllowed", regex: /^[\w.]+$/ },
].reduce(
  (acc, cur) => ({
    ...acc,
    [cur.type]: (username) => regexTest({ regex: cur.regex, str: username }),
  }),
  {}
);
