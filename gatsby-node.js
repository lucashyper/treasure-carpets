exports.onCreateNode = ({ node, getNode, actions, graphql }) => {};

exports.setFieldsOnGraphQLNodeType = ({
  type,
  getNodesByType,
  getNode,
  actions
}) => {
  if (type.name === `DataXlsx__Carpet`) {
    const { createNodeField, createParentChildLink } = actions;

    let RelativePathImage = {};

    const imageNodes = getNodesByType("ImageSharp");
    for (const node of imageNodes) {
      const parent = getNode(node.parent);
      RelativePathImage[parent.relativePath] = node;
    }

    const rowNodes = getNodesByType("DataXlsx__Carpet");
    for (const node of rowNodes) {
      const imageNodeIds = node.image_files
        .split(",")
        .map(name => `images/${name}`)
        .map(relativePath => {
          const imageNode = RelativePathImage[relativePath];
          return imageNode.id;
        });

      createNodeField({
        node,
        name: "images___NODE",
        value: imageNodeIds
      });
    }
  }
};
