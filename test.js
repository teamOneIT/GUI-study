const tensors = data.subgraphs[0].tensors;
const graph = document.getElementById("graph");
const operators = data.subgraphs[0].operators;

function makeNode(str, element) {
  let operator;
  for (op of metadata) {
    if (op.name.toLowerCase().replace(/\_/g, "") === str.toLowerCase().replace(/\_/g, "")) {
      operator = op;
      break;
    }
  }

  const attributes = operator?.attributes;
  const inputs = operator?.inputs;
  const outputs = operator?.outputs;
  const category = operator?.category;

  const operatorBox = document.createElement("div");
  const operatorName = document.createElement("h2");
  operatorName.innerText = op.name;

  const titleColor = opTitleColor[str];

  operatorName.setAttribute("style", `background-color: #${titleColor};`);
  operatorName.setAttribute("class", "op_title");
  operatorBox.appendChild(operatorName);

  if (inputs) {
    let inputBox;
    let inputName;
    for (let i = 1; i < inputs.length; i++) {
      inputBox = document.createElement("div");
      inputName = document.createElement("span");
      inputName.innerText = op.inputs[i].name;
      inputBox.appendChild(inputName);
      if (element) {
        const inputShape = document.createElement("span");
        inputShape.innerText = "<" + tensors[element.inputs[i]].shape.join("x") + ">";
        inputBox.appendChild(inputShape);
      }
      operatorBox.appendChild(inputBox);
    }
    graph.appendChild(operatorBox);
    operatorBox.setAttribute("class", "node");
  }
}

for (operator of operators) {
  let num = data.operatorCodes[operator.opcodeIndex].deprecatedBuiltinCode;
  let opName;
  if (num >= 0) {
    opName = BuiltinOperator[num];
  } else {
    opName = BuiltinOperator[String(num)];
  }

  makeNode(opName, operator);
}
