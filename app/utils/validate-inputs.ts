import { User } from "../types/types";

type InputData = {
  title: string;
  content: string;
}

export function getCurrentDate() {
  const currentDate = new Date().toISOString();
  return currentDate.slice(0, 10);
}

export function validateInputData(inputData: InputData) {
  const errors: Partial<InputData> = {};
  if (!inputData.title) {
    errors.title = "Title is required";
  }

  if (inputData.title.length < 4 || inputData.title.length > 50) {
    errors.title = "Title must be between 4 and 20 characters";
  }

  if (!inputData.content) {
    errors.content = "Content is required";
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return {};
}

export function validateAuthInputs(inputData: Pick<User, "first_name" | "last_name" | "email" | "password">) {
  const errors: Partial<User> = {};

  if (!inputData.first_name) {
    errors.first_name = "First name is required";
  }

  if (inputData.first_name.length < 3) {
    errors.first_name = "First name must be at least 3 characters";
  }

  if (!inputData.last_name) {
    errors.last_name = "Last name is required";
  }

  if (inputData.last_name.length < 3) {
    errors.last_name = "Last name must be at least 3 characters";
  }


  if (!inputData.email) {
    errors.email = "Email is required";
  }

  if (!isEmailValid(inputData.email)) {
    errors.email = "Email is invalid";
  }

  if (!inputData.password) {
    errors.password = "Password is required";
  }

  if (inputData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return {};
}

function isEmailValid(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Regex by AI Copilot
  return emailRegex.test(email);
}