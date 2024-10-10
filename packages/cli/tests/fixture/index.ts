import { Adapter } from "@gqlpt/adapter-base";

import { GQLPTClient } from "gqlpt";

export async function functionUsedInTesting() {
  const gqlpt = new GQLPTClient({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - used for testing
    adapter: new Adapter(),
  });

  await gqlpt.connect();

  const queryText1 = "Find users by id 1, return the name and id";
  const query1 = await gqlpt.generateAndSend(queryText1);
  console.log(query1);

  // const queryText2 = "Find users by id 2"; test inline
  const query2 = await gqlpt.generateAndSend(
    "find posts by user id 2, return id and title, and body",
  );
  console.log(query2);
}
