exports.solve = function(fileName) {
    let formula = readFormula(fileName);
    let result = doSolve(formula.clauses, formula.variables);
    return result;
}
console.log(solve('fileName.cnf')); //change fileName here

function solve(fileName) {
    let formula = readFormula(fileName);
    let result = doSolve(formula.clauses, formula.variables);
    return result;
}
function nextAssignment(currentAssignment) {
    return newAssignment(currentAssignment, 0);
}
function newAssignment(variables, i) {
    variables[i] = !variables[i];
    if (!variables[i] && i < variables.length - 1) {

        return newAssignment(variables, i + 1);
    } else {
        return variables;
    }
}
function doSolve(clauses, assignment) {
    let isSat = false;
    let boolAux = false, aux;
    let cont = 0;
    while ((!isSat) && (cont < Math.pow(2, assignment.length))) {
        isSat = true;
        for (let i = 0; i < clauses.length; i++){
            boolAux=false;
            for (let j = 0; j <clauses[i].length; j++){
                if(parseInt(clauses[i][j])<=0){
                    aux = !assignment[-(clauses[i][j])-1];
                }else{
                    aux = assignment[(clauses[i][j])-1];
                }
                boolAux = boolAux||aux;
            }
            isSat = isSat && boolAux;
        }
        if(!isSat) {
            assignment = nextAssignment(assignment);
        }else{
            satisfyingAssignment = assignment;
        }
        cont++;
    }
    let result = {'isSat': isSat, satisfyingAssignment: null}
    if (isSat) {
        result.satisfyingAssignment = assignment;
    }
    return result;
}
function readFormula(fileName) {
    const fs=require(`fs`);
    let x = ``+fs.readFileSync(fileName);
    let text = x.split(`\n`);
    let clauses = readClauses(text);


    let variables = readVariables(clauses);
    let specOk = checkProblemSpecification(text, clauses, variables);
    let result = { 'clauses': [], 'variables': [] }
    if (specOk) {
        result.clauses = clauses;
        result.variables = variables;
    }

    return result;
}

function readClauses(text) {
    let textAux = '';
    let result;
    for (let i = 0; i < text.length; i++) {
        if(text[i].charAt(0)!=="c" && text[i].charAt(0) !== "p") {
            textAux += text[i];
        }

    }
    result = textAux.split(" 0");
    for (let i = 0; i < result.length; i++) {
        result[i] = result[i].split(/ /);
        for (let j = 0; j < result[i].length; j ++) {
            if (result[i][j] == '') {
                result[i].splice(j,1);
                j--;
            }
        }
        if(result[i][0]==undefined){
            result.splice(i,1);
            i--;
        }
    }
    return result;
}

function readVariables(clauses) {
    let result = [];
    let aux = 0;
    let boolAux = true;
    for (let i = 0; i < clauses.length; i++) {
        for (let j = 0; j < clauses[i].length; j++) {
            aux = parseInt(clauses[i][j]);
            boolAux = true;
            for (let k = 0; k < result.length; k++) {
                if (aux === result[k] || aux === -result[k]) {
                    boolAux = false;
                }
            }
            if (boolAux) {
                result.push(aux);
            }
        }
    }
    for (let i = 0; i < result.length; i++) {
        result[i] = false;
    }
    return result;
}
function checkProblemSpecification(text, clauses, variables) {
    let aux, nClauses, nVariables, result;
    for (var i = 0; i < text.length; i++) {
        if (text[i].charAt(0) == "p") {
            aux = text[i].split(' ');
            nClauses = aux[3];
            nVariables = aux[2];
        }
    }
    result = (clauses.length == nClauses && variables.length == nVariables);
    return result;
}
