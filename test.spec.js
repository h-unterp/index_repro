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
    var res = await adminClient.query(
      Paginate(Match(Index("things_by_selectMe")), { size: 5 })
    );
    //console.log(res);
    var after = res.after[0];
    var res2 = await adminClient.query(
      Paginate(Match(Index("things_by_selectMe")), { size: 5, after: after })
    );
    //console.log(res2);
  });

  it("after does not work", async function () {
    var res = await adminClient.query(
      Paginate(
        Join(
          Match(Index("things_by_selectMe")),
          Lambda("ref", Match(Index("all_things")))
        ),
        { size: 5 }
      )
    );
    //this returns 9-5
    console.log(res);

    var after = res.after[0];
    var res2 = await adminClient.query(
      Paginate(
        Join(
          Match(Index("things_by_selectMe")),
          Lambda("ref", Match(Index("all_things")))
        ),
        { size: 5, after: after }
      )
    );
    //this also returns 9-5, after does not work
    console.log(res2);
  });
});

import "dotenv/config";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { generalTestSetup } from "./support/testDBSetup.js";
import faunadb from "faunadb";
const q = faunadb.query;
const { Create, Collection, Paginate, Match, Index, Join, Lambda } =
  faunadb.query;
