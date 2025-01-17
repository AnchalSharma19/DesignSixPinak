// src/resources/scripts/collections/blogPost.js

function blogPostsCollection(collectionApi) {
    return collectionApi.getFilteredByGlob("./src/blogs/*.md").sort((a, b) => {
        // Sort by 'recent' field or default order if available
        if (a.data.recent && !b.data.recent) {
            return -1;
        } else if (!a.data.recent && b.data.recent) {
            return 1;
        }
        // Sort by 'order' field if 'recent' is the same
        if (a.data.recent && b.data.recent) {
            return (a.data.order || 0) - (b.data.order || 0);
        }
        return 0;
    });
}

module.exports = { blogPostsCollection };
