let adminClient = null;

chai.use(chaiAsPromised);
chai.should();
let TOPIC = "index_repro";

describe(TOPIC, function () {
  before("this is before", async () => {
    adminClient = await generalTestSetup(TOPIC + "-spec");

    //create 10 docs
    for (let i = 0; i < 10; i++) {
      await adminClient.query(
        Create(Collection("things"), {
          data: {
            selectMe: "hi" + i,
          },
        })
      );
    }
  });

  it("after works", async function () {
    //this works
    var res = await adminClient.query(
      Paginate(Match(Index("things_binding")), { size: 5 })
    );
    //console.log(res);
    var after = res.after[0];
    var res2 = await adminClient.query(
      Paginate(Match(Index("things_binding")), { size: 5, after: after })
    );
    //console.log(res2);
  });

  it("workaround", async function () {
    var res = await handlePromiseError(
      adminClient.query(
        Paginate(
          Let(
            {
              binding_set: Match(Index("things_binding")),
              page: Select(
                "data",
                Paginate(Var("binding_set"), { size: 100000 })
              ),
              leaf_sets: Map(
                Var("page"),
                Lambda(
                  ["selectMe", "ref"],
                  Match(Index("things_by_selectMe"), Var("selectMe"))
                )
              ),
              uni: Union(Var("leaf_sets")),
            },
            Var("uni")
          )
        )
      )
    );
    console.log(res);
  });
});

import "dotenv/config";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { generalTestSetup } from "./support/testDBSetup.js";
import faunadb from "faunadb";
import { handlePromiseError } from "./support/errors.js";
const q = faunadb.query;
const {
  Create,
  Collection,
  Paginate,
  Match,
  Index,
  Let,
  Lambda,
  Map,
  Select,
  Var,
  Union,
} = faunadb.query;
