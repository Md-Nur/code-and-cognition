import { handlers } from "@/auth";

console.log("Auth route initialized", { handlers });
const { GET, POST } = handlers;
export { GET, POST };
