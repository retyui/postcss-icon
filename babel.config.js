"use strict";

module.exports = api => {
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "8.0.0"
          }
        }
      ]
    ],
    plugins: [
      "@babel/plugin-proposal-object-rest-spread",
      "babel-plugin-add-module-exports"
    ]
  };
};
