import faunadb from "faunadb";
import "dotenv/config";
const q = faunadb.query;
const {
  Update,
  CreateFunction,
  Query,
  Var,
  If,
  Exists,
  Lambda,
  Call,
  Function,
} = q;
import { LetItBe } from "./funcdef.js";

const CreateOrUpdateFunction = function (obj) {
  return If(
    Exists(q.Function(obj.name)),
    Update(q.Function(obj.name), { body: obj.body, role: obj.role }),
    CreateFunction({ name: obj.name, body: obj.body, role: obj.role })
  );
};

const LetTest = CreateOrUpdateFunction({
  name: "let_test",
  body: Query(Lambda(["arg"], LetItBe(Var("arg")))),
  role: "admin",
});

var client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET,
  domain: "db.us.fauna.com",
});

client
  .query(Call(Function("let_test"), "hey"))
  .then((response) => console.log(response));
