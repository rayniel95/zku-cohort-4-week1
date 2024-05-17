pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib-matrix/circuits/matMul.circom"; // hint: you can use more than one templates in circomlib-matrix to help you
include "../../node_modules/circomlib-matrix/circuits/matElemSum.circom";
include "../../node_modules/circomlib-matrix/circuits/matSub.circom";


template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    // [bonus] insert your code here
    signal x_vector[n][1];
    signal b_vector[n][1];

    for (var i=0; i<n; i++) {
        for (var j=0; j<1; j++) {
            x_vector[i][j] <== x[i];
            b_vector[i][j] <== b[i];
        }
    }

    component matMul = matMul(n, n, 1);
    component matSub = matSub(n, 1);
    component matElemSum = matElemSum(n, 1);
    component isZero = IsZero();

    matMul.a <== A;
    matMul.b <== x_vector;

    matSub.a <== matMul.out;
    matSub.b <== b_vector;

    matElemSum.a <== matSub.out;
    
    isZero.in <== matElemSum.out;
    out <== isZero.out;
}

component main {public [A, b]} = SystemOfEquations(3);