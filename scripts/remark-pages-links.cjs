// Raw MDX anchors do not receive Docusaurus's automatic baseUrl handling.
// The personal Pages build links generated API trees to the official handbook.
module.exports = function pagesLinks({baseUrl}) {
  const apiUrl = (url) => url.startsWith('/api/')
    ? `https://book.robonix.ai${url}`
    : url;

  return function transform(tree) {
    function visit(node) {
      if (node.type === 'link' || node.type === 'definition') {
        node.url = apiUrl(node.url);
      }
      if (node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement') {
        for (const attribute of node.attributes ?? []) {
          if (attribute.name !== 'href' || typeof attribute.value !== 'string') continue;
          const url = attribute.value;
          if (url.startsWith('/api/')) {
            attribute.value = apiUrl(url);
          } else if (url.startsWith('/') && !url.startsWith('//')) {
            attribute.value = `${baseUrl}${url.slice(1)}`;
          }
        }
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
};
