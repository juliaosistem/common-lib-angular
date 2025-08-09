module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Custom rule to ignore log lines in max-lines-per-function",
      category: "Best Practices",
      recommended: false,
    },
    schema: [], // No opciones adicionales
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      FunctionDeclaration(node) {
        const lines = sourceCode.getText(node).split("\n");
        const filteredLines = lines.filter(
          (line) => !/this\.log(Info|Error|Warn|Debug)\(/.test(line.trim())
        );

        if (filteredLines.length > 22) {
          context.report({
            node,
            message: `Function '${node.id.name}' exceeds the maximum line limit (22 lines excluding logs).`,
          });
        }
      },
    };
  },
};