module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    "babel-plugin-react-compiler",
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          "@assets": "./src/assets",
          "@screens": "./src/screens",
        },
      },
    ],
  ],
};
