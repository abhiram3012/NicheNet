// utils/decodeJWT.ts
export const decodeJWT = (token: string) => {
  try {
    const payload = token.split('.')[1]; // get the middle part
    return JSON.parse(atob(payload));
  } catch (err) {
    console.error("Invalid JWT token:", err);
    return null;
  }
};
