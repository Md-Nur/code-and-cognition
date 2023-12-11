let token = "";

let allChar =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@$%^&*_:?-";
let charLength = allChar.length;

for (let i = 0; i < 32; i++) {
  let random = Math.floor(Math.random() * charLength);
  token += allChar.substring(random, random + 1);
}
console.log(token);
