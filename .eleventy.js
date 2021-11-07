const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: "dynamic",
    functionsDir: "./netlify/functions/",
  });

  return {
    dir: {
      input: "src",
    }
  }
};