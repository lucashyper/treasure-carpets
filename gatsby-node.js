exports.onCreateNode = ({ node, getNode, actions, graphql }) => {};

exports.setFieldsOnGraphQLNodeType = ({
  type,
  getNodesByType,
  getNode,
  actions
}) => {
  if (type.name === `DataXlsx__Carpet`) {
    const { createNodeField, createParentChildLink } = actions;

    let codeImages = {};

    const imageNodes = getNodesByType("ImageSharp");
    for (const node of imageNodes) {
      const parent = getNode(node.parent);
      const fileName = parent.name;
      const beforeDash = fileName.split("-")[0]; //Carpet code

      codeImages[beforeDash] = codeImages[beforeDash] || [];
      codeImages[beforeDash].push({ id: node.id, fileName });
    }

    const rowNodes = getNodesByType("DataXlsx__Carpet");
    for (const node of rowNodes) {
      const carpetCode = node.code;

      let imageNodeIds = codeImages[carpetCode]
        .sort(function(a, b) {
          // Sort so that "G001" is first
          if (a.fileName < b.fileName) {
            return -1;
          }
          if (a.fileName > b.fileName) {
            return 1;
          }
          return 0;
        })
        .map(image => image.id);

      console.log(imageNodeIds);

      createNodeField({
        node,
        name: "mainImage___NODE",
        value: imageNodeIds[0]
      });

      // createNodeField({
      //   node,
      //   name: "images___NODE",
      //   value: imageNodeIds.slice(1)
      // });
    }
  }
};
