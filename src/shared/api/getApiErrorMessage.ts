import axios from "axios";

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      // store-api отдаёт ошибки в массиве errors
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return String(data.errors[0]);
      }
      if ("message" in data) {
        return String(data.message);
      }
    }
    return error.message;
  }

  if (error instanceof Error) return error.message;

  return "Something went wrong";
}
