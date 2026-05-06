import { Scoreboard, ScoreboardObjective, Player, world } from "@minecraft/server";

/**
 * Advanced scoreboard utility class for Minecraft Bedrock Edition
 * Provides simplified methods for managing scoreboard objectives and player scores
 * 
 * @example
 * ```typescript
 * import { world } from "@minecraft/server";
 * import { Advancedboard } from "@mcbepack/api";
 * 
 * // Initialize the scoreboard
 * Advancedboard.initialize(world.scoreboard);
 * 
 * // Set a player's score
 * Advancedboard.set("kills", player, 10);
 * 
 * // Add to a player's score
 * Advancedboard.add("kills", player, 5);
 * 
 * // Get a player's score
 * const kills = Advancedboard.get("kills", player);
 * ```
 */
export class Advancedboard {
    /** The Minecraft scoreboard instance to operate on */
    public static scoreboard: Scoreboard;

    static initialize(scoreboard: Scoreboard) {
        this.scoreboard = scoreboard;
        return this;
    }

    /**
     * Gets or creates a scoreboard objective
     * If the objective doesn't exist, it will be created automatically
     * 
     * @private
     * @param name - Name of the scoreboard objective
     * @returns The scoreboard objective instance
     */
    private static getObjective(name: string) {
        this.scoreboard.addObjective(name);
        return this.scoreboard.getObjective(name) as ScoreboardObjective;
    }

    /**
     * Gets a player's score from a scoreboard objective
     * 
     * @param name - Name of the scoreboard objective
     * @param player - The player to get the score for
     * @returns The player's score, or 0 if not set
     * 
     * @example
     * ```typescript
     * const score = Advancedboard.get("points", player);
     * console.log(`Player has ${score} points`);
     * ```
     */
    public static get(name: string, player: Player) {
        const objective = this.getObjective(name);
        return objective.getScore(player) ?? 0;
    }

    /**
     * Sets a player's score in a scoreboard objective
     * 
     * @param name - Name of the scoreboard objective
     * @param player - The player to set the score for
     * @param value - The score value to set
     * @returns The Advancedboard class for method chaining
     * 
     * @example
     * ```typescript
     * Advancedboard.set("health", player, 100);
     * ```
     */
    public static set(name: string, player: Player, value: number) {
        const objective = this.getObjective(name);
        objective.setScore(player, value);
        return this;
    }

    /**
     * Adds a value to a player's current score in a scoreboard objective
     * 
     * @param name - Name of the scoreboard objective
     * @param player - The player to add the score to
     * @param value - The value to add to the current score
     * @returns The Advancedboard class for method chaining
     * 
     * @example
     * ```typescript
     * Advancedboard.add("kills", player, 1);
     * ```
     */
    public static add(name: string, player: Player, value: number) {
        this.set(name, player, this.get(name, player) + value);
        return this;
    }

    /**
     * Resets a player's score to 0 in a scoreboard objective
     * 
     * @param name - Name of the scoreboard objective
     * @param player - The player to reset the score for
     * @returns The Advancedboard class for method chaining
     * 
     * @example
     * ```typescript
     * Advancedboard.reset("deaths", player);
     * ```
     */
    public static reset(name: string, player: Player) {
        this.set(name, player, 0);
        return this;
    }

    /**
     * Subtracts a value from a player's current score in a scoreboard objective
     * 
     * @param name - Name of the scoreboard objective
     * @param player - The player to subtract the score from
     * @param value - The value to subtract from the current score
     * @returns The Advancedboard class for method chaining
     * 
     * @example
     * ```typescript
     * Advancedboard.delete("coins", player, 50);
     * ```
     */
    public static delete(name: string, player: Player, value: number) {
        this.set(name, player, this.get(name, player) - value);
        return this;
    }
}