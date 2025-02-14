export function generateRandomPassword(length: number): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

  if (length < 8) {
    throw new Error("Password length must be at least 8 characters.");
  }

  const allCharacters = uppercase + lowercase + numbers + symbols;

  // Ensure password has at least one of each required character type
  const getRandomChar = (charset: string) =>
    charset.charAt(Math.floor(Math.random() * charset.length));

  const passwordArray = [
    getRandomChar(uppercase),
    getRandomChar(lowercase),
    getRandomChar(numbers),
    getRandomChar(symbols),
  ];

  // Fill the rest of the password length with random characters from allCharacter sets
  for (let i = passwordArray.length; i < length; i++) {
    passwordArray.push(getRandomChar(allCharacters));
  }

  // Shuffle the password array to ensure randomness
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join("");
}
