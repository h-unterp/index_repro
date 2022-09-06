let adminClient=null;

chai.use(chaiAsPromised);
chai.should();
let TOPIC = "index_repro";

describe(TOPIC, function () {
  before('this is before', async () => {
    adminClient = await generalTestSetup(TOPIC + "-spec");
  });

  it("get no ads", async function () {
    //ensure ads doesn't fail with 0 ads
    return getAds(loggedInClient, Math.random()).then(async function (res) {
      chai.expect(res[0]).to.deep.equal(NO_AD);
    });
  });


});
import "dotenv/config";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { generalTestSetup } from "./support/testDBSetup.js";