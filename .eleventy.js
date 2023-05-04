const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
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
