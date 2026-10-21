import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    rules: {
      // The dashboard resets or loads state in effects on purpose (a new list
      // clears the editor, the QR code needs window.location), so this
      // React Compiler rule only flags working code.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  { ignores: [".next/**", "next-env.d.ts"] },
];

export default config;
