export default {
  spec_dir: "src/tests",
  helpers: ["helpers/**/*.?(m)js"],
  spec_files: [
    "**/*.test.js",
    "**/*.test.ts",
    "**/*.test.jsx",
    "**/*.test.tsx",
  ],
  // helpers: ["helpers/**/*.?(m)js"],
  env: {
    stopSpecOnExpectationFailure: false,
    random: true,
    forbidDuplicateNames: true,
  },
};
