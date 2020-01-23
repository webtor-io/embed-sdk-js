module.exports = {
    // "extends": ["google", "plugin:vue/recommended"],
    "extends": ["google"],
    "parser": "babel-eslint",
    "parserOptions": {
      "sourceType": "module",
      "ecmaVersion": 8,
      "ecmaFeatures": {
        "experimentalObjectRestSpread": true
      }
    },
    "rules": {
      "max-len": [2, 80, 4, {"ignoreUrls": true, "ignoreStrings": true,
        "ignoreComments": true, "ignoreTemplateLiterals": true}],
      "require-jsdoc": "off",
      "no-invalid-this": "off",
      "chai-expect/missing-assertion": 2,
      "chai-expect/terminating-properties": 1,
      "mocha/no-exclusive-tests": 2
    },
    "plugins": [
      "eslint-plugin-html",
      "mocha",
      "chai-expect",
      "vue"
    ]
};
