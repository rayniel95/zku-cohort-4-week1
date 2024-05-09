const fs = require("fs");
const solidityRegex = /^pragma solidity [^;]+( [^;]+)*;$/

const verifierRegex = /contract\s+([a-zA-Z_$][a-zA-Z_$0-9]*)/

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", 'utf-8');

let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0;');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

content = fs.readFileSync("./contracts/Multiplier3Verifier_plonk.sol", 'utf-8');

bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0;');
bumped = bumped.replace(verifierRegex, 'contract Multiplier3Verifier_plonk');

fs.writeFileSync("./contracts/Multiplier3Verifier_plonk.sol", bumped);
// ---------------

content = fs.readFileSync("./contracts/Multiplier3Verifier.sol", 'utf-8');

bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0;');
bumped = bumped.replace(verifierRegex, 'contract Multiplier3Verifier');

fs.writeFileSync("./contracts/Multiplier3Verifier.sol", bumped);