import { beforeEach, describe, expect, mock, test } from "bun:test";

mock.module("@minecraft/server", () => ({
    world: {
        scoreboard: undefined,
        afterEvents: {
            worldLoad: {
                subscribe: mock(),
            },
        },
    },
    system: {
        run: (callback: () => void) => callback(),
    },
}));

const { Advancedboard } = await import("./advanced-board");

function createScoreboard() {
    const objectives = new Map<string, { scores: Map<object, number> }>();
    const scoreboard = {
        addObjective: mock((name: string) => {
            const objective = {
                scores: new Map<object, number>(),
                getScore(player: object) {
                    return this.scores.get(player);
                },
                setScore(player: object, value: number) {
                    this.scores.set(player, value);
                },
            };
            objectives.set(name, objective);
            return objective;
        }),
        getObjective: mock((name: string) => objectives.get(name)),
    };

    return scoreboard;
}

describe("Advancedboard", () => {
    let scoreboard: ReturnType<typeof createScoreboard>;
    let player: object;

    beforeEach(() => {
        scoreboard = createScoreboard();
        player = {};
        Advancedboard.initialize(scoreboard as never);
    });

    test("creates an objective only once", () => {
        Advancedboard.set("coins", player as never, 10);
        Advancedboard.add("coins", player as never, 5);

        expect(scoreboard.addObjective).toHaveBeenCalledTimes(1);
        expect(Advancedboard.get("coins", player as never)).toBe(15);
    });

    test("resets and subtracts scores", () => {
        Advancedboard.set("coins", player as never, 10);
        Advancedboard.delete("coins", player as never, 3);
        expect(Advancedboard.get("coins", player as never)).toBe(7);

        Advancedboard.reset("coins", player as never);
        expect(Advancedboard.get("coins", player as never)).toBe(0);
    });
});
