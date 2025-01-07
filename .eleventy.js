const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
    // Configure Markdown-It with Footnote support
    const markdownItInstance = markdownIt({
        html: true,
        breaks: true,
        linkify: true,
        typographer: true,
    }).use(markdownItFootnote);

    eleventyConfig.setLibrary("md", markdownItInstance);

    // Add Markdown Filter
    eleventyConfig.addFilter("markdown", (content) => {
        return markdownItInstance.render(content || "");
    });

    // Add Eleventy Navigation Plugin
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // Passthrough File Copies
    eleventyConfig.addPassthroughCopy("src/resources/assets");
    eleventyConfig.addPassthroughCopy("src/resources/css");
    eleventyConfig.addPassthroughCopy("src/resources/scripts");

    // Watch Targets
    eleventyConfig.addWatchTarget("./src/resources/css/");
    eleventyConfig.addWatchTarget("./src/resources/scripts/");

    // Custom Blog Posts Collection
    eleventyConfig.addCollection("blogPosts", function (collectionApi) {
        return collectionApi.getFilteredByGlob("./src/blogs/*.md").sort((a, b) => {
            // Sorting Logic
            if (a.data.recent && !b.data.recent) {
                return -1;
            } else if (!a.data.recent && b.data.recent) {
                return 1;
            }
            if (a.data.recent && b.data.recent) {
                return (a.data.order || 0) - (b.data.order || 0);
            }
            return 0;
        });
    });

    // Eleventy Configuration
    return {
        dir: {
            input: "src",
            includes: "_includes",
            output: "_site",
        },
        templateFormats: ["md", "njk", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
    };
};
