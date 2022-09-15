import pkg from 'faunadb';
const { Let, Var } = pkg;
var Thing;
(function (Thing) {
    Thing["Thing1"] = "thing_thing";
})(Thing || (Thing = {}));
export const LetItBe = function (arg) {
    return Let({
        thing1: arg,
    }, Var("thing1"));
};
//# sourceMappingURL=funcdef.js.map