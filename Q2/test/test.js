const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
// load snarkjs
const { groth16, plonk } = require("snarkjs");
// load a tool that allow to execute some methods in a circom circuit
const wasm_tester = require("circom_tester").wasm;
// NOTE - i have'nt idea
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

describe("HelloWorld", function () {
    this.timeout(100000000);
    let Verifier;
    let verifier;

    beforeEach(async function () {
        //NOTE - deploy the verifier in a local blockchain
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Circuit should multiply two numbers correctly", async function () {
        //NOTE - load the circom circuit
        const circuit = await wasm_tester("contracts/circuits/HelloWorld.circom");

        const INPUT = {
            "a": 2,
            "b": 3
        }
        //NOTE - calculate the witness. it have 1 in the first position, 
        // the output signal value in the second and the input signal value in the next
        const witness = await circuit.calculateWitness(INPUT, true);

        // console.log(witness);

        assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]), Fr.e(6)));

    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        //NOTE - calcualte the witness and generate the proof
        const { proof, publicSignals } = await groth16.fullProve({ "a": "2", "b": "3" }, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm", "contracts/circuits/HelloWorld/circuit_final.zkey");

        console.log('2x3 =', publicSignals[0]);
        //NOTE - using the proof and the public signals a calldata to send to de
        // verifier smart contract is created
        const calldata = await groth16.exportSolidityCallData(proof, publicSignals);
        //NOTE - transform the calldata from a string to js types to send to the sc
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());

        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {
    this.timeout(100000000);
    let Verifier;
    let verifier;
    beforeEach(async function () {
        //[assignment] insert your script here
        //NOTE - deploy the verifier in a local blockchain
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Circuit should multiply three numbers correctly", async function () {
        //[assignment] insert your script here
        //NOTE - load the circom circuit
        const circuit = await wasm_tester("contracts/circuits/Multiplier3.circom");

        const INPUT = {
            "a": 2,
            "b": 3,
            "c": 4
        }
        //NOTE - calculate the witness. it have 1 in the first position, 
        // the output signal value in the second and the input signal value in the next
        const witness = await circuit.calculateWitness(INPUT, true);

        // console.log(witness);

        assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]), Fr.e(24)));
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        //NOTE - calcualte the witness and generate the proof
        const { proof, publicSignals } = await groth16.fullProve(
            {
                "a": "2", "b": "3", "c": "4"
            },
            "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm",
            "contracts/circuits/Multiplier3/circuit_final.zkey"
        );

        console.log('2x3x4 =', publicSignals[0]);
        //NOTE - using the proof and the public signals a calldata to send to de
        // verifier smart contract is created
        const calldata = await groth16.exportSolidityCallData(proof, publicSignals);
        // console.log(calldata);
        //NOTE - transform the calldata from a string to js types to send to the sc
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        // console.log(argv);
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });

    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {
    this.timeout(100000000);
    let Verifier;
    let verifier;
    beforeEach(async function () {
        //[assignment] insert your script here
        //NOTE - deploy the verifier in a local blockchain
        Verifier = await ethers.getContractFactory("Multiplier3Verifier_plonk");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        //NOTE - calcualte the witness and generate the proof
        const { proof, publicSignals } = await plonk.fullProve(
            {
                "a": "2", "b": "3", "c": "4"
            },
            "contracts/circuits/Multiplier3_plonk/Multiplier3_plonk_js/Multiplier3_plonk.wasm",
            "contracts/circuits/Multiplier3_plonk/circuit_0000.zkey"
        );

        console.log('2x3x4 =', publicSignals[0]);
        //NOTE - using the proof and the public signals a calldata to send to de
        // verifier smart contract is created
        const calldata = await plonk.exportSolidityCallData(proof, publicSignals);
        console.log(calldata);
        //NOTE - transform the calldata from a string to js types to send to the sc
        let Input = calldata.split("][")[1].replace(/["[\]\s]/g, "")
        Input = [BigInt(Input).toString()];

        let a = calldata.split("][")[0].replace(/["[\]\s]/g, "").split(",").map(x => BigInt(x).toString());
        
        expect(await verifier.verifyProof(a, Input)).to.be.true;
    });

    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = [];
        for (let index = 0; index < 24; index++) {
            a.push(0);
        }
        let Input = [0]
        expect(await verifier.verifyProof(a, Input)).to.be.false;
    });
});