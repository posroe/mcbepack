import enquirer from 'enquirer';
import { constants } from '@mcbepack/common';

const extension = async () => {
    const response = await enquirer.prompt<{ extensions: string[] }>({
        type: 'multiselect',
        name: 'extensions',
        message: 'Select a extension type?',
        choices: [
            { name: 'behavior', message: 'Behavior Pack' },
            { name: 'resource', message: 'Resource Pack' },
        ]
    });
    return response;
};

const api = async () => {
    const response = await enquirer.prompt<{ api: string }>({
        type: "confirm",
        name: "api",
        message: "Do you want to add a script api to behavior?",
        initial: true
    });
    return response;
};

const info = async () => {
    const response = await enquirer.prompt<{
        name: string;
        description: string;
        author: string;
        minimumEngineVersion: string;
    }>([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the project?',
        },
        {
            type: 'input',
            name: 'description',
            message: 'What is the description of the project?',
        },
        {
            type: 'input',
            name: 'author',
            message: 'What is the author\'s name? Use commas to separate multiple authors(,).',
        },
        {
            type: 'input',
            name: 'minimumEngineVersion',
            message: 'What is the minimum engine version required?',
            validate: input => {
                if (input.length === 0) return 'Minimum engine version is required';
                const version = input.split('.');
                const response = 'Minimum engine version must be in the format x.x.x';
                return version.every((v) => !isNaN(parseInt(v))) || response;
            }
        }
    ]);
    return response
};

const script = async () => {
    const response = await enquirer.prompt<{
        language: "typescript" | "javascript";
        release: "stable" | "beta" | "preview";
        packages: Array<typeof constants.packages.modules[number] | typeof constants.packages.plugins[number]>;
    }>([
        {
            type: 'select',
            name: 'language',
            message: 'Which language do you want to use?',
            choices: ['typescript', 'javascript']
        },
        {
            type: 'select',
            name: 'release',
            message: 'What game type would you like to use?',
            choices: ['stable', 'beta', 'preview'],
        },
        {
            type: 'multiselect',
            name: 'packages',
            message: 'Which packages would you like to add?',
            choices: [
                ...constants.packages.modules,
                ...constants.packages.plugins
            ],
            validate: input => input.length > 0 || 'At least one package is required'
        }
    ]);
    return response;
};

const confirm = async (options: { message: string; default?: boolean }) => {
    const response = await enquirer.prompt<{ confirmed: boolean }>({
        type: "confirm",
        name: "confirmed",
        message: options.message,
        initial: options.default ?? true
    });
    return response;
};

export default { extension, api, info, script, confirm }