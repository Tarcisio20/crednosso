import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // ou "warn"
      "@typescript-eslint/no-explicit-any": "off", // opcional
      "react-hooks/exhaustive-deps": "warn", // ou "off" se quiser desligar
      "prefer-const": "warn", // se quiser só avisar
      "@typescript-eslint/no-wrapper-object-types": "warn", // trocar Boolean por boolean, por ex
    },
  },
];

export default eslintConfig;
