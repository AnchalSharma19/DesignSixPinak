const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { addPagesWithSchema, addBreadcrumbSchema } = require("./src/resources/scripts/schema.js");
const { breadcrumbsFilter } = require("./src/resources/scripts/filters/breadcrumbs.js");
const { DateTime } = require("luxon");
const { execSync } = require("child_process");


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

    // Schemas 
    addPagesWithSchema(eleventyConfig);
    addBreadcrumbSchema(eleventyConfig);

    // Breadcrumbs filter
    eleventyConfig.addFilter("breadcrumbs", breadcrumbsFilter);


    // Add Eleventy Navigation Plugin
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // Passthrough File Copies
    eleventyConfig.addPassthroughCopy("src/resources/assets");
    eleventyConfig.addPassthroughCopy("src/resources/css");
    eleventyConfig.addPassthroughCopy("src/resources/scripts");

    // Watch Targets
    eleventyConfig.addWatchTarget("./src/resources/css/");
    eleventyConfig.addWatchTarget("./src/resources/scripts/");
    eleventyConfig.addWatchTarget('./src/resources/schemas/');
    eleventyConfig.addPassthroughCopy("src/resources/xml");


    // Blog Collection
    eleventyConfig.addCollection("recentBlogPosts", function (collectionApi) {
        return collectionApi.getAll()
            .filter(item => item.data.recent && item.data.publishDate) // Ensure 'recent' and 'publishDate' exist
            .sort((a, b) => new Date(b.data.publishDate) - new Date(a.data.publishDate)) // Sort by publishDate
            .slice(0, 3); // Limit to 3 posts
    });


    eleventyConfig.addFilter("date", (date, format = "yyyy-MM-dd") => {
        if (!date) {
            return "";
        }
        return DateTime.fromJSDate(new Date(date)).toFormat(format);
    });


    eleventyConfig.addFilter("getGitLastModifiedDate", function (inputPath) {
        try {
            const gitCommand = `git log -1 --format=%ci ${inputPath}`;
            const result = execSync(gitCommand).toString().trim();
            return result ? new Date(result) : null;
        } catch (error) {
            console.error(`Error fetching Git last modified date for ${inputPath}:`, error);
            return null;
        }
    });



    // Eleventy Configuration
    return {
        dir: {
            input: "src",
            includes: "_includes",
            output: "_site",
        },
        templateFormats: ["md", "njk", "html", "xml"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
    };
};
