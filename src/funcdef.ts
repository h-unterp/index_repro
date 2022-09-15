import pkg from 'faunadb';
const { Let, Var } = pkg;

enum Thing {
    Thing1 = "thing_thing",
}

export const LetItBe = function (arg: string) {
    return Let(
        {
            thing1: arg as Thing,
        },
        Var("thing1")
    );
};