export const BASE_URL =
process.env.NODE_ENV === "development"
  ? "http://localhost:8000"
  : "";

export const USERS_URL = "/api/v1/users";
export const PROJECT_URL = "/api/v1/projects";