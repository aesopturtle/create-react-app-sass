#!/usr/bin/env node

const findRemove = require('find-remove');
const path       = require('path');
const spawn      = require('cross-spawn');

const args = process.argv;
args.splice(0, 2);
const runScriptsCommand   = args.shift();
const runScriptsArguments = args;
const mainCommand = args.slice(-1);

const mainCommands = {
    start: startApp,
    build: buildApp
};

function startApp() {
    removeCss();
    runScripts();
}

function buildApp() {
    removeCss();
    runScriptsSync();
}

function removeCss() {
    findRemove(path.join(process.cwd(), 'src'), { extensions: '.css' });
}

function runScripts() {
    spawn(runScriptsCommand, runScriptsArguments, { stdio: 'inherit' });

    spawn('node-sass', [
        'src',
        '--output',
        'src'
    ], {
        stdio: 'inherit'
    });

    spawn('node-sass', [
        'src',
        '--watch',
        '--output',
        'src'
    ], {
        stdio: 'inherit'
    });
}

function runScriptsSync() {
    spawn.sync('node-sass', [
        'src',
        '--output',
        'src'
    ], {
        stdio: 'inherit'
    });

    spawn.sync(runScriptsCommand, runScriptsArguments, { stdio: 'inherit' });
}

if (mainCommand in mainCommands) {
    mainCommands[mainCommand]();
    return;
}

console.error('Unknown script: ' + mainCommand);
console.error('Perhaps you meant to run `react-scripts` or `create-app-with-sass react-scripts start`');

