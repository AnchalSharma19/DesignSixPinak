eleventyConfig.addCollection("recentBlogPosts", function (collectionApi) {
    return collectionApi.getAll()
        .filter(item => item.data.recent && item.data.publishDate) // Ensure 'recent' and 'publishDate' exist
        .sort((a, b) => new Date(b.data.publishDate) - new Date(a.data.publishDate)) // Sort by publishDate
        .slice(0, 3); // Limit to 3 posts
});
