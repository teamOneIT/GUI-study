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
  let opName;

  if (num >= 0) {
    opName = BuiltinOperator[num];
  } else {
    opName = BuiltinOperator[String(num)];
  }
  name.innerText = opName;

  const input_box = document.createElement("div");
  const input = document.createElement("h2");
  const output = document.createElement("h2");
  input.innerText = "Inputs";
  output.innerText = "Outputs";

  let input_info;
  for (meta of metadata) {
    if (opName.toLowerCase().replace(/\_/g, "") === meta.name.toLowerCase()) {
      input_info = meta.inputs;
      break;
    }
  }

  for (i in input_info) {
    if (input_info[i].name !== "input") {
      const tensor_box = document.createElement("div");
      const tensor_name = document.createElement("p");
      const tensor_shape = tensors[operator.inputs[i]].shape;
      tensor_name.innerText = input_info[i].name + `<${tensor_shape.join("×")}>`;
      tensor_box.appendChild(tensor_name);
      input_box.appendChild(tensor_box);
    }
  }

  if (input_box.childElementCount > 0) {
    oper_box.appendChild(input);
    oper_box.appendChild(input_box);
    const br = document.createElement("br");
    oper_box.appendChild(br);
  }

  // oper_box.appendChild(output);

  // let output_info;
  // for (meta of metadata) {
  //   if (opName.toLowerCase().replace(/\_/g, "") === meta.name.toLowerCase()) {
  //     output_info = meta.outputs;
  //     break;
  //   }
  // }

  // for (o of output_info) {
  //   const tensor_box = document.createElement("div");
  //   const tensor_name = document.createElement("p");
  //   tensor_name.innerText = o.name;
  //   tensor_box.appendChild(tensor_name);
  //   oper_box.appendChild(tensor_box);
  // }

  main.appendChild(oper_box);
  const hr = document.createElement("hr");
  main.appendChild(hr);
}
