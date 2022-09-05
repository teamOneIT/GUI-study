const tensors = data.subgraphs[0].tensors;
const graph = document.getElementById("graph");
const operators = data.subgraphs[0].operators;
const viewer = document.getElementById("viewer");
const func = ["NONE", "RELU", "RELU_N1_TO_1", "RELU6", "TANH", "SIGN_BIT"];

function detail(num) {
  while (viewer.hasChildNodes()) {
    viewer.removeChild(viewer.firstChild);
  }

  const op = operators[num];
  const str = BuiltinOperator[data.operatorCodes[op.opcodeIndex].deprecatedBuiltinCode];
  let name;
  let index;
  for (idx in metadata) {
    if (metadata[idx].name.toLowerCase().replace(/\_/g, "") === str.toLowerCase().replace(/\_/g, "")) {
      name = operators[num].name;
      index = idx;
      break;
    }
  }

    let attribute = op?.builtinOptions;
    const inputs = op?.inputs;
    const outputs = op?.outputs;
    const category = op?.category;

    const nodeProperties = document.createElement("div");
    const title = document.createElement("h3");
    title.innerText = "NODE PROPERTIES";
    nodeProperties.appendChild(title);
    const info = document.createElement("div");
    info.setAttribute("class", "info");
    const type = document.createElement("div");
    const location = document.createElement("div");
    type.setAttribute("style", "display:flex;");
    location.setAttribute("style", "display:flex;");
    const locationSubtitle = document.createElement("div");
    const locationContext = document.createElement("div");
    const typeSubtitle = document.createElement("div");
    const typeContext = document.createElement("div");

    typeSubtitle.innerText = "type  ";
    locationSubtitle.innerText = "location  ";
    typeSubtitle.setAttribute("class", "subtitle");
    locationSubtitle.setAttribute("class", "subtitle");
    typeContext.setAttribute("class", "context");
    locationContext.setAttribute("class", "context");
    locationContext.innerText = num;
    typeContext.innerText = name;
    type.appendChild(typeSubtitle);
    type.appendChild(typeContext);
    location.appendChild(locationSubtitle);
    location.appendChild(locationContext);
    info.appendChild(type);
    info.appendChild(location);
    nodeProperties.appendChild(info);
    viewer.appendChild(nodeProperties);

    if (attribute) {
        const temp = [];
        attribute = Object.entries(attribute);
        for (i in attribute) {
            console.log(metadata[index].attributes[i].name);
            console.log(attribute[i]);
            temp.push([metadata[index].attributes[i].name, attribute[i], metadata[index].attributes[i].type]);
        }
        temp.sort();
        console.log(temp);
        const attributes = document.createElement("div");
        const title = document.createElement("h3");
        title.innerText = "ATTRIBUTES";
        attributes.appendChild(title);
        viewer.appendChild(attributes);
        const info = document.createElement("div");
        info.setAttribute("class", "info");

        for (i in temp) {
            const box = document.createElement("div");
            box.setAttribute("style", "display:flex");
            const subtitle = document.createElement("div");
            subtitle.setAttribute("class", "subtitle");
            subtitle.innerText = temp[i][0];
            const context = document.createElement("div");
            context.setAttribute("class", "context");
            const contextType = document.createElement("span");
            contextType.setAttribute("class", "contexttype");
            if (temp[i][0] === "fused_activation_function") {
                context.innerText = func[temp[i][1][1]];
            } else if (temp[i][0] === "padding") {
                context.innerText = "VALID";
            } else {
                context.innerText = temp[i][1][1];
            }
            contextType.innerText = " (type : " + temp[i][2] + ")";
            context.appendChild(contextType);
            box.appendChild(subtitle);
            box.appendChild(context);
            info.appendChild(box);
            info.setAttribute("class", "info");
        }
        viewer.appendChild(info);
    }
    viewer.appendChild(attributes);
  }
}

function makeNode(str, element, i) {
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
  const operatorName = document.createElement("h3");
  operatorName.innerText = op.name;
  operatorName.addEventListener("click", () => detail(i));

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
  }

  if (element?.builtinOptions?.fusedActivationFunction) {
    const actType = document.createElement("h3");
    actType.setAttribute("class", "act_type_box");
    const typeName = activationFunctionType[String(element.builtinOptions.fusedActivationFunction)];
    actType.innerText = typeName;
    operatorBox.appendChild(actType);
  }

  graph.appendChild(operatorBox);
  operatorBox.setAttribute("class", "node");
}

for (i in operators) {
  let num = data.operatorCodes[operators[i].opcodeIndex].deprecatedBuiltinCode;
  let opName;
  if (num >= 0) {
    opName = BuiltinOperator[num];
  } else {
    opName = BuiltinOperator[String(num)];
  }

  makeNode(opName, operators[i], i);
}
