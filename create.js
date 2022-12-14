import faunadb from "faunadb";
const q = faunadb.query;
const {
  Exists,
  If,
  Collection,
  Lambda,
  Var,
  Select,
  CreateCollection,
  CreateIndex,
  Query,
  Index,
} = faunadb.query;

const CreateThingsCollection = CreateCollection({
  name: "things",
});

export const CreateIndexThingsSelect = CreateIndex({
  name: "things_binding",
  source: [
    {
      collection: Collection("things"),
      fields: {
        theBinding: Query(
          Lambda("doc", Select(["data", "selectMe"], Var("doc")))
        ),
      },
    },
  ],
  values: [
    {
      binding: "theBinding",
      reverse: true,
    },
    {
      field: ["ref"],
    },
  ],
});

export const CreateIndexThings = CreateIndex({
  name: "things_by_selectMe",
  source: [
    {
      collection: Collection("things"),
    },
  ],
  terms: [
    {
      field: ["data", "selectMe"],
    },
  ],
  values: [
    {
      field: ["ref"],
    },
  ],
});

export const createThingsCollection = async function (client) {
  await client.query(
    If(Exists(Collection("things")), true, CreateThingsCollection)
  );
  await client.query(
    If(Exists(Index("things_binding")), true, CreateIndexThingsSelect)
  );
  await client.query(If(Exists(Index("things_by_selectMe")), true, CreateIndexThings));
};
