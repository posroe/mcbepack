import { ScoreboardObjective, ScoreboardIdentity } from "@minecraft/server";
/**
 * Scoreboard utility class for managing Minecraft scoreboards
 */
export declare class Scoreboard {
    /**
     * Get or create a scoreboard objective
     * @param objectiveName - The name of the objective
     * @param displayName - Optional display name for the objective
     * @returns The scoreboard objective
     */
    static getOrCreateObjective(objectiveName: string, displayName?: string): ScoreboardObjective;
    /**
     * Get an existing objective (returns undefined if not found)
     * @param objectiveName - The name of the objective
     * @returns The scoreboard objective or undefined
     */
    static getObjective(objectiveName: string): ScoreboardObjective | undefined;
    /**
     * Set a score for a participant
     * @param objectiveName - The name of the objective
     * @param participant - The participant (player name or entity)
     * @param score - The score to set
     */
    static setScore(objectiveName: string, participant: string | ScoreboardIdentity, score: number): void;
    /**
     * Get a score for a participant
     * @param objectiveName - The name of the objective
     * @param participant - The participant (player name or entity)
     * @returns The score or undefined if not found
     */
    static getScore(objectiveName: string, participant: string | ScoreboardIdentity): number | undefined;
    /**
     * Add to a participant's score
     * @param objectiveName - The name of the objective
     * @param participant - The participant (player name or entity)
     * @param amount - The amount to add
     */
    static addScore(objectiveName: string, participant: string | ScoreboardIdentity, amount: number): void;
    /**
     * Remove an objective
     * @param objectiveName - The name of the objective to remove
     * @returns true if removed, false if not found
     */
    static removeObjective(objectiveName: string): boolean;
    /**
     * Check if an objective exists
     * @param objectiveName - The name of the objective
     * @returns true if exists, false otherwise
     */
    static hasObjective(objectiveName: string): boolean;
}
