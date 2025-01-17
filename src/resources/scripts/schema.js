const fs = require("fs");
const path = require("path");

const domain = "https://yourdomain.com";
const homeLabel = "Home";

function addPagesWithSchema(eleventyConfig) {
    eleventyConfig.addCollection("pagesWithSchema", function (collectionApi) {
        return collectionApi.getAll().map((item) => {
            if (item.data.schemaFiles && Array.isArray(item.data.schemaFiles)) {
                item.data.schemas = []; // Initialize an array to hold schemas
                item.data.schemaFiles.forEach((schemaFile) => {
                    const schemaPath = path.join(
                        __dirname,
                        "../schemas/",
                        schemaFile
                    );

                    try {
                        // Read and parse each schema file
                        const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
                        item.data.schemas.push(schema); // Push the schema to the array
                    } catch (error) {
                        console.error(`Error reading schema file: ${schemaPath}`, error);
                    }
                });
            }
            return item;
        });
    });
}

function addBreadcrumbSchema(eleventyConfig) {
    eleventyConfig.addCollection("allPages", function (collectionApi) {
        const allPages = collectionApi.getAll();

        console.log("All pages found:");
        allPages.forEach((page) => console.log(page.url));

        // Create breadcrumb schema for each page
        allPages.forEach((page) => {
            const breadcrumbs = createBreadcrumbSchema(page.url);

            // Attach the breadcrumb schema to the page's data
            page.data.breadcrumbSchema = breadcrumbs;
        });

        return allPages;
    });
}

// Helper function to create breadcrumb schema
function createBreadcrumbSchema(url) {
    // Handle home page case
    if (url === "/") {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": homeLabel,
                    "item": domain,
                },
            ],
        };
    }

    // Split the URL into parts (assumes URL segments are breadcrumb levels)
    const pathParts = url.split("/").filter((part) => part.length > 0);

    // Add home as the first breadcrumb
    const breadcrumbList = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": homeLabel,
            "item": domain,
        },
    ];

    // Map each part into the breadcrumb schema
    pathParts.forEach((part, index) => {
        const breadcrumbUrl = "/" + pathParts.slice(0, index + 1).join("/");
        breadcrumbList.push({
            "@type": "ListItem",
            "position": index + 2, // position starts from 2 here
            "name": capitalizeFirstLetter(part),
            "item": `${domain}${breadcrumbUrl}`,
        });
    });

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbList,
    };
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string
        .split('-') // Split the string by hyphen
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join the words with a space
}

module.exports = { addPagesWithSchema, addBreadcrumbSchema };