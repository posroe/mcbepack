/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
import * as __WEBPACK_EXTERNAL_MODULE__minecraft_server_fb7572af__ from "@minecraft/server";
/******/ var __webpack_modules__ = ({

/***/ "./scripts/index.ts"
/*!**************************!*\
  !*** ./scripts/index.ts ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _minecraft_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @minecraft/server */ \"@minecraft/server\");\n/* harmony import */ var _mcbepack_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mcbepack/api */ \"../api/out/index.js\");\n\n\nconst dp = new _mcbepack_api__WEBPACK_IMPORTED_MODULE_1__.DynamicProperty(\"test\", _minecraft_server__WEBPACK_IMPORTED_MODULE_0__.world);\n_minecraft_server__WEBPACK_IMPORTED_MODULE_0__.world.afterEvents.entityHitBlock.subscribe((event) => {\n    _mcbepack_api__WEBPACK_IMPORTED_MODULE_1__.Advancedboard.set(\"test\", _minecraft_server__WEBPACK_IMPORTED_MODULE_0__.world.getAllPlayers()[0], 1);\n    const data = dp.find((data) => data.name === \"test\");\n    if (data) {\n        dp.update((data) => data.name === \"test\", { name: \"test\", value: ++data.value });\n    }\n    else {\n        dp.create({ name: \"test\", value: 1 });\n    }\n    console.log(dp.find((data) => data.name === \"test\").value);\n});\n\n\n//# sourceURL=webpack://bebug/./scripts/index.ts?\n}");

/***/ },

/***/ "@minecraft/server"
/*!************************************!*\
  !*** external "@minecraft/server" ***!
  \************************************/
(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__minecraft_server_fb7572af__;

/***/ },

/***/ "../api/out/advanced-board.js"
/*!************************************!*\
  !*** ../api/out/advanced-board.js ***!
  \************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Advancedboard: () => (/* binding */ Advancedboard)\n/* harmony export */ });\n/**\n * Advanced scoreboard utility class for Minecraft Bedrock Edition\n * Provides simplified methods for managing scoreboard objectives and player scores\n *\n * @example\n * ```typescript\n * import { world } from \"@minecraft/server\";\n * import { Advancedboard } from \"@mcbepack/api\";\n *\n * // Initialize the scoreboard\n * Advancedboard.initialize(world.scoreboard);\n *\n * // Set a player's score\n * Advancedboard.set(\"kills\", player, 10);\n *\n * // Add to a player's score\n * Advancedboard.add(\"kills\", player, 5);\n *\n * // Get a player's score\n * const kills = Advancedboard.get(\"kills\", player);\n * ```\n */\nclass Advancedboard {\n    /** The Minecraft scoreboard instance to operate on */\n    static scoreboard;\n    static initialize(scoreboard) {\n        this.scoreboard = scoreboard;\n        return this;\n    }\n    /**\n     * Gets or creates a scoreboard objective\n     * If the objective doesn't exist, it will be created automatically\n     *\n     * @private\n     * @param name - Name of the scoreboard objective\n     * @returns The scoreboard objective instance\n     */\n    static getObjective(name) {\n        this.scoreboard.addObjective(name);\n        return this.scoreboard.getObjective(name);\n    }\n    /**\n     * Gets a player's score from a scoreboard objective\n     *\n     * @param name - Name of the scoreboard objective\n     * @param player - The player to get the score for\n     * @returns The player's score, or 0 if not set\n     *\n     * @example\n     * ```typescript\n     * const score = Advancedboard.get(\"points\", player);\n     * console.log(`Player has ${score} points`);\n     * ```\n     */\n    static get(name, player) {\n        const objective = this.getObjective(name);\n        return objective.getScore(player) ?? 0;\n    }\n    /**\n     * Sets a player's score in a scoreboard objective\n     *\n     * @param name - Name of the scoreboard objective\n     * @param player - The player to set the score for\n     * @param value - The score value to set\n     * @returns The Advancedboard class for method chaining\n     *\n     * @example\n     * ```typescript\n     * Advancedboard.set(\"health\", player, 100);\n     * ```\n     */\n    static set(name, player, value) {\n        const objective = this.getObjective(name);\n        objective.setScore(player, value);\n        return this;\n    }\n    /**\n     * Adds a value to a player's current score in a scoreboard objective\n     *\n     * @param name - Name of the scoreboard objective\n     * @param player - The player to add the score to\n     * @param value - The value to add to the current score\n     * @returns The Advancedboard class for method chaining\n     *\n     * @example\n     * ```typescript\n     * Advancedboard.add(\"kills\", player, 1);\n     * ```\n     */\n    static add(name, player, value) {\n        this.set(name, player, this.get(name, player) + value);\n        return this;\n    }\n    /**\n     * Resets a player's score to 0 in a scoreboard objective\n     *\n     * @param name - Name of the scoreboard objective\n     * @param player - The player to reset the score for\n     * @returns The Advancedboard class for method chaining\n     *\n     * @example\n     * ```typescript\n     * Advancedboard.reset(\"deaths\", player);\n     * ```\n     */\n    static reset(name, player) {\n        this.set(name, player, 0);\n        return this;\n    }\n    /**\n     * Subtracts a value from a player's current score in a scoreboard objective\n     *\n     * @param name - Name of the scoreboard objective\n     * @param player - The player to subtract the score from\n     * @param value - The value to subtract from the current score\n     * @returns The Advancedboard class for method chaining\n     *\n     * @example\n     * ```typescript\n     * Advancedboard.delete(\"coins\", player, 50);\n     * ```\n     */\n    static delete(name, player, value) {\n        this.set(name, player, this.get(name, player) - value);\n        return this;\n    }\n}\n\n\n//# sourceURL=webpack://bebug/../api/out/advanced-board.js?\n}");

/***/ },

/***/ "../api/out/dynamic-property.js"
/*!**************************************!*\
  !*** ../api/out/dynamic-property.js ***!
  \**************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DynamicProperty: () => (/* binding */ DynamicProperty)\n/* harmony export */ });\n/* harmony import */ var _minecraft_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @minecraft/server */ \"@minecraft/server\");\n\n/**\n * A generic database class for Minecraft Bedrock Edition\n * Stores data using dynamic properties and provides CRUD operations\n *\n * @template T - The type of data to store (will automatically include an 'id' field)\n *\n * @example\n * ```typescript\n * // Create a database for player stats\n * const statsDb = new Database<{ kills: number, deaths: number }>(\"stats\", world);\n *\n * // Create a new entry\n * const id = statsDb.create({ kills: 10, deaths: 5 });\n *\n * // Find an entry\n * const entry = statsDb.find((data) => data.id === id);\n * ```\n */\nclass DynamicProperty {\n    collectionName;\n    storageType;\n    /** In-memory cache of all database entries */\n    sets = new Set();\n    /**\n     * Creates a new database instance\n     *\n     * @param collectionName - Name of the collection (1-16 characters, used as dynamic property key)\n     * @param storageType - Where to store the data (World, Entity, Player, or ItemStack)\n     * @throws Error if collection name is invalid or initialization fails\n     */\n    constructor(collectionName, storageType) {\n        this.collectionName = collectionName;\n        this.storageType = storageType;\n        // Validate collection name length (Minecraft dynamic property limitation)\n        if (collectionName.length < 1 || collectionName.length > 16) {\n            throw new Error('Collection name must be between 1 and 16 characters');\n        }\n        // Load existing data from storage\n        this.initialize();\n    }\n    /**\n     * Loads existing data from dynamic properties into memory\n     * Called automatically during construction\n     *\n     * @private\n     * @throws Error if data cannot be loaded or parsed\n     */\n    initialize() {\n        try {\n            _minecraft_server__WEBPACK_IMPORTED_MODULE_0__.world.afterEvents.worldLoad.subscribe(() => {\n                // Retrieve stored JSON string from dynamic properties\n                const data = this.storageType.getDynamicProperty(this.collectionName);\n                if (data) {\n                    // Parse JSON and populate in-memory cache\n                    const entries = JSON.parse(data);\n                    for (const data of entries) {\n                        this.sets.add(data);\n                    }\n                }\n            });\n        }\n        catch (error) {\n            throw new Error(`Failed to initialize database: ${error}`);\n        }\n    }\n    /**\n     * Persists in-memory data to dynamic properties\n     * Called automatically after any data modification\n     *\n     * @private\n     * @throws Error if data cannot be saved\n     */\n    saveChanges() {\n        try {\n            // Convert Set to Array and serialize to JSON\n            const entries = Array.from(this.sets.values());\n            this.storageType.setDynamicProperty(this.collectionName, JSON.stringify(entries));\n        }\n        catch (error) {\n            throw new Error(`Failed to save changes: ${error}`);\n        }\n    }\n    /**\n     * Generates a unique ID for new database entries\n     * Combines timestamp and random string in base36 format\n     *\n     * @private\n     * @returns A unique identifier string\n     */\n    generateId() {\n        // Use timestamp for uniqueness across time\n        const timestamp = Date.now().toString(36);\n        // Add random component for uniqueness within same millisecond\n        const random = Math.random().toString(36).substring(2, 10);\n        return timestamp + random;\n    }\n    /**\n     * Creates a new entry in the database\n     *\n     * @param data - The data to store (id will be auto-generated)\n     * @returns The generated ID of the new entry\n     *\n     * @example\n     * ```typescript\n     * const id = db.create({ name: \"Steve\", level: 5 });\n     * ```\n     */\n    create(data) {\n        if (\"id\" in data) {\n            throw new Error(\"ID cannot be provided during creation\");\n        }\n        const id = this.generateId();\n        // Merge user data with generated ID\n        this.sets.add({\n            id,\n            ...data\n        });\n        // Persist to storage\n        this.saveChanges();\n        return id;\n    }\n    /**\n     * Finds a single entry matching the predicate\n     *\n     * @param papredicate - Function to test each entry\n     * @returns The first matching entry or null if not found\n     *\n     * @example\n     * ```typescript\n     * const player = db.find((data) => data.name === \"Steve\");\n     * ```\n     */\n    find(papredicate) {\n        try {\n            return Array.from(this.sets.values()).find(papredicate);\n        }\n        catch (error) {\n            return null;\n        }\n    }\n    /**\n     * Returns all entries in the database\n     *\n     * @returns Array of all database entries\n     *\n     * @example\n     * ```typescript\n     * const allPlayers = db.findMany();\n     * ```\n     */\n    findMany() {\n        return Array.from(this.sets.values());\n    }\n    /**\n     * Finds all entries where a specific field matches a value\n     *\n     * @param key - The field name to match\n     * @param value - The value to match\n     * @returns Array of matching entries\n     *\n     * @example\n     * ```typescript\n     * const level5Players = db.findLike(\"level\", 5);\n     * ```\n     */\n    findLike(key, value) {\n        return Array.from(this.sets.values()).filter((data) => data[key] === value);\n    }\n    /**\n     * Counts entries in the database\n     *\n     * @param predicate - Optional filter function\n     * @returns Number of entries (matching predicate if provided)\n     *\n     * @example\n     * ```typescript\n     * const totalPlayers = db.count();\n     * const highLevelPlayers = db.count((data) => data.level > 10);\n     * ```\n     */\n    count(predicate) {\n        return predicate ? Array.from(this.sets.values()).filter(predicate).length : this.sets.size;\n    }\n    /**\n     * Deletes a single entry matching the predicate\n     *\n     * @param predicate - Function to find the entry to delete\n     *\n     * @example\n     * ```typescript\n     * db.delete((data) => data.id === \"abc123\");\n     * ```\n     */\n    delete(predicate) {\n        const data = this.find(predicate);\n        if (data) {\n            this.sets.delete(data);\n            this.saveChanges();\n        }\n    }\n    /**\n     * Updates a single entry matching the predicate\n     *\n     * @param predicate - Function to find the entry to update\n     * @param data - Partial data to merge with existing entry\n     *\n     * @example\n     * ```typescript\n     * db.update((data) => data.id === \"abc123\", { level: 10 });\n     * ```\n     */\n    update(predicate, data) {\n        const existingData = this.find(predicate);\n        if (existingData) {\n            // Remove old entry\n            this.sets.delete(existingData);\n            // Add updated entry (merge existing with new data)\n            this.sets.add({\n                ...existingData,\n                ...data\n            });\n            this.saveChanges();\n        }\n    }\n    /**\n     * Removes all entries from the database\n     *\n     * @example\n     * ```typescript\n     * db.clear(); // Deletes all data\n     * ```\n     */\n    clear() {\n        this.sets.clear();\n        this.saveChanges();\n    }\n}\n\n\n//# sourceURL=webpack://bebug/../api/out/dynamic-property.js?\n}");

/***/ },

/***/ "../api/out/index.js"
/*!***************************!*\
  !*** ../api/out/index.js ***!
  \***************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Advancedboard: () => (/* reexport safe */ _advanced_board_js__WEBPACK_IMPORTED_MODULE_1__.Advancedboard),\n/* harmony export */   DynamicProperty: () => (/* reexport safe */ _dynamic_property_js__WEBPACK_IMPORTED_MODULE_0__.DynamicProperty)\n/* harmony export */ });\n/* harmony import */ var _dynamic_property_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dynamic-property.js */ \"../api/out/dynamic-property.js\");\n/* harmony import */ var _advanced_board_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./advanced-board.js */ \"../api/out/advanced-board.js\");\n\n\n\n\n//# sourceURL=webpack://bebug/../api/out/index.js?\n}");

/***/ }

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Check if module exists (development only)
/******/ 	if (__webpack_modules__[moduleId] === undefined) {
/******/ 		var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 		e.code = 'MODULE_NOT_FOUND';
/******/ 		throw e;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module can't be inlined because the eval devtool is used.
/******/ var __webpack_exports__ = __webpack_require__("./scripts/index.ts");
/******/ 
