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
    /*
           this returns
           {
         after: [
           'hi4',
           Ref(Collection("things"), "342139790713421900"),
           Ref(Collection("things"), "342139790713421900")
         ],
         data: [
           [ 'hi9', Ref(Collection("things"), "342139791030091852") ],
           [ 'hi8', Ref(Collection("things"), "342139790964031564") ],
           [ 'hi7', Ref(Collection("things"), "342139790905311308") ],
           [ 'hi6', Ref(Collection("things"), "342139790838202444") ],
           [ 'hi5', Ref(Collection("things"), "342139790781579340") ]
         ]
       }
    */

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
           /*this does not return the next 5 docs:
           {
         before: [ 'hi4' ],
         after: [
           'hi4',
           Ref(Collection("things"), "342139790713421900"),
           Ref(Collection("things"), "342139790713421900")
         ],
         data: [
           [ 'hi9', Ref(Collection("things"), "342139791030091852") ],
           [ 'hi8', Ref(Collection("things"), "342139790964031564") ],
           [ 'hi7', Ref(Collection("things"), "342139790905311308") ],
           [ 'hi6', Ref(Collection("things"), "342139790838202444") ],
           [ 'hi5', Ref(Collection("things"), "342139790781579340") ]
         ]
       }
    */

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
