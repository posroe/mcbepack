import { system, world } from "@minecraft/server";
import { DynamicProperty, Advancedboard } from "@mcbepack/api";

const dp = new DynamicProperty<{ name: string, value: number }>("test", world);
world.afterEvents.entityHitBlock.subscribe((event) => {
    const data = dp.find((data) => data.name === "test");
    if (data) {
        dp.update((data) => data.name === "test", { name: "test", value: ++data.value });
    } else {
        dp.create({ name: "test", value: 1 });
    }
    console.log(dp.find((data) => data.name === "test").value);
});