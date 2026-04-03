const TITLE_PATTERN = /^[^\s]+$/;

export const validateTitle = (title: string): "TITLE_REQUIRED" | "TITLE_INVALID" | null => {
  if (title === "") return "TITLE_REQUIRED";
  if (!TITLE_PATTERN.test(title)) return "TITLE_INVALID";
  return null;
};
