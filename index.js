const tensors = data.subgraphs[0].tensors;
const operators = data.subgraphs[0].operators;
const start_tensor = data.subgraphs[0].inputs;
const end_tensor = data.subgraphs[0].outputs;

const main = document.querySelector("#main");

for (const operator of operators) {
  const oper_box = document.createElement("div");
  const name = document.createElement("h1");
  oper_box.appendChild(name);
  let num = data.operatorCodes[operator.opcodeIndex].deprecatedBuiltinCode;
  if (num >= 0) {
    name.innerText = BuiltinOperator[num];
  } else {
    name.innerText = BuiltinOperator[String(num)];
  }

  const input = document.createElement("h2");
  const output = document.createElement("h2");
  input.innerText = "Inputs";
  output.innerText = "Outputs";

  oper_box.appendChild(input);
  for (i of operator.inputs) {
    const tensor_box = document.createElement("div");
    const tensor_name = document.createElement("p");
    tensor_name.innerText = tensors[i].name;
    tensor_box.appendChild(tensor_name);
    oper_box.appendChild(tensor_box);
  }
  const br = document.createElement("br");
  oper_box.appendChild(br);

  oper_box.appendChild(output);
  for (o of operator.outputs) {
    const tensor_box = document.createElement("div");
    const tensor_name = document.createElement("p");
    tensor_name.innerText = tensors[o].name;
    tensor_box.appendChild(tensor_name);
    oper_box.appendChild(tensor_box);
  }
  main.appendChild(oper_box);
  const hr = document.createElement("hr");
  main.appendChild(hr);
}
