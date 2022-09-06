let adminClient=null;

chai.use(chaiAsPromised);
chai.should();
let TOPIC = "index_repro";

describe(TOPIC, function () {
  before('this is before', async () => {
    adminClient = await generalTestSetup(TOPIC + "-spec");
  });

  it("example test", async function () {
    //do something
  });


});
import "dotenv/config";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { generalTestSetup } from "./support/testDBSetup.js";