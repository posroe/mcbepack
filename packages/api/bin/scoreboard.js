import { world } from "@minecraft/server";
/**
 * Scoreboard utility class for managing Minecraft scoreboards
 */
export class Scoreboard {
    /**
     * Get or create a scoreboard objective
     * @param objectiveName - The name of the objective
     * @param displayName - Optional display name for the objective
     * @returns The scoreboard objective
     */
    static getOrCreateObjective(objectiveName, displayName) {
        let objective = world.scoreboard.getObjective(objectiveName);
        if (!objective) {
            objective = world.scoreboard.addObjective(objectiveName, displayName || objectiveName);
        }
        return objective;
    }
    /**
     * Get an existing objective (returns undefined if not found)
     * @param objectiveName - The name of the objective
     * @returns The scoreboard objective or undefined
     */
    static getObjective(objectiveName) {
        return world.scoreboard.getObjective(objectiveName);
    }
    /**
     * Set a score for a participant
     * @param objectiveName - The name of the objective
     * @param participant - The participant (player name or entity)
     * @param score - The score to set
     */
    static setScore(objectiveName, participant, score) {
        const objective = this.getOrCreateObjective(objectiveName);
        objective.setScore(participant, score);
    }
    /**
     * Get a score for a participant
     * @param objectiveName - The name of the objective
     * @param participant - The participant (player name or entity)
     * @returns The score or undefined if not found
     */
    static getScore(objectiveName, participant) {
        const objective = world.scoreboard.getObjective(objectiveName);
        if (!objective) {
            return undefined;
        }
        try {
            return objective.getScore(participant);
        }
        catch {
            return undefined;
        }
    }
    /**
     * Add to a participant's score
     * @param objectiveName - The name of the objective
     * @param participant - The participant (player name or entity)
     * @param amount - The amount to add
     */
    static addScore(objectiveName, participant, amount) {
        const objective = this.getOrCreateObjective(objectiveName);
        const currentScore = objective.getScore(participant) ?? 0;
        objective.setScore(participant, currentScore + amount);
    }
    /**
     * Remove an objective
     * @param objectiveName - The name of the objective to remove
     * @returns true if removed, false if not found
     */
    static removeObjective(objectiveName) {
        const objective = world.scoreboard.getObjective(objectiveName);
        if (!objective) {
            return false;
        }
        world.scoreboard.removeObjective(objective);
        return true;
    }
    /**
     * Check if an objective exists
     * @param objectiveName - The name of the objective
     * @returns true if exists, false otherwise
     */
    static hasObjective(objectiveName) {
        return world.scoreboard.getObjective(objectiveName) !== undefined;
    }
}
