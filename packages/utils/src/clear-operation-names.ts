import {
  DefinitionNode,
  DocumentNode,
  Kind,
  OperationDefinitionNode,
} from "graphql";

export function clearOperationNames(doc: DocumentNode): DocumentNode {
  const newAst: DocumentNode = {
    kind: Kind.DOCUMENT,
    definitions: doc.definitions.map((def: DefinitionNode) => {
      if (def.kind === Kind.OPERATION_DEFINITION) {
        const newDef: OperationDefinitionNode = {
          kind: Kind.OPERATION_DEFINITION,
          operation: def.operation,
          variableDefinitions: def.variableDefinitions,
          directives: def.directives,
          selectionSet: def.selectionSet,
          name: undefined,
        };
        return newDef;
      }
      return def;
    }),
  };
  return newAst;
}
