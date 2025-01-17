function breadcrumbsFilter(url) {
    if (!url) return "";
    const segments = url.split("/").filter(segment => segment); // Remove empty segments
    let currentPath = "";
    return segments.map(segment => {
        currentPath += `/${segment}`;
        const displayName = segment.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
        return `<a href="${currentPath}" class="hover:underline">${displayName}</a>`;
    }).join(" / ");
}

module.exports = { breadcrumbsFilter };