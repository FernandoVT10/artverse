export default (length: number): string => {
  let text = "";

  while (length > 0) {
    const randomNumber = Math.random();
    // here we generate a random string
    const randomText = randomNumber.toString(36);
    // and we want just 1 character, then we slice it
    text += randomText.slice(2, 3);

    length--;
  }

  return text;
};
