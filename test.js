const tensors = data.subgraphs[0].tensors;
const graph = document.getElementById("graph");
const operators = data.subgraphs[0].operators;
const viewer = document.getElementById("viewer");

function makeTitle(name) {
    const titleArea = document.createElement("div");
    const title = document.createElement("h3");
    title.innerText = name;
    titleArea.appendChild(title);

    return titleArea;
}

function makeArea(str) {
    const area = document.createElement("div");
    area.setAttribute("class", str);

    return area;
}

function makeDetailArea(sub, con, type) {
    const detail = document.createElement("div");
    detail.setAttribute("style", "display:flex;");
    const subtitle = document.createElement("div");
    const context = document.createElement("div");
    const contextType = document.createElement("span");
    subtitle.setAttribute("class", "subtitle");
    context.setAttribute("class", "context");
    contextType.setAttribute("class", "contexttype");
    subtitle.innerText = sub + "  ";
    context.innerText = con;
    contextType.innerText = type;
    if (type) context.appendChild(contextType);
    detail.appendChild(subtitle);
    detail.appendChild(context);

    return detail;
}

function sliceString(str) {
    let ret = [];
    for (i in str) {
        ret.push(str[i]);
        if (str[i] === "/") {
            ret.push("\n");
        }
    }
    ret = ret.join("");

    return ret;
}

function makeIOBox(sub, con) {
    const box = document.createElement("div");
    box.setAttribute("class", "iobox");
    const subtitle = document.createElement("span");
    subtitle.innerText = sub + ": ";
    const context = document.createElement("span");
    context.setAttribute("class", "iocontext");
    if (con && con.length > 40) {
        con = sliceString(con);
    }
    context.innerText = con;
    box.appendChild(subtitle);
    box.appendChild(context);

    return box;
}

function makeIOArea(sub, data) {
    const detail = document.createElement("div");
    detail.setAttribute("style", "display:flex;");
    const subtitle = document.createElement("div");
    subtitle.setAttribute("class", "subtitle");
    subtitle.innerText = sub + "  ";
    const context = document.createElement("div");
    context.setAttribute("class", "context");
    detail.append(subtitle);
    detail.append(context);

    const nameBox = makeIOBox("name", data.name);
    const typeBox = makeIOBox("type", TensorType[data.type] + "[" + data.shape.join(", ") + "]");
    const locationBox = makeIOBox("location", data.buffer - 1);
    const bufferBox = makeIOBox("buffer");

    context.appendChild(nameBox);
    context.appendChild(typeBox);
    context.appendChild(locationBox);

    return detail;
}

function detailPanel(num) {
    while (viewer.hasChildNodes()) {
        viewer.removeChild(viewer.firstChild);
    }

    const op = operators[num];
    const str = BuiltinOperator[data.operatorCodes[op.opcodeIndex].deprecatedBuiltinCode];
    let name;
    let index;
    for (idx in metadata) {
        if (metadata[idx].name.toLowerCase().replace(/\_/g, "") === str.toLowerCase().replace(/\_/g, "")) {
            name = metadata[idx].name;
            index = idx;
            break;
        }
    }

    let attribute = op?.builtinOptions;
    const inputs = op?.inputs;
    const outputs = op?.outputs;
    const category = op?.category;

    const nodeProperties = makeTitle("NODE PROPERTIES");
    const nodePropertiesInfo = makeArea("info");
    const type = makeDetailArea("type", name);
    const location = makeDetailArea("location", num);

    nodePropertiesInfo.appendChild(type);
    nodePropertiesInfo.appendChild(location);
    nodeProperties.appendChild(nodePropertiesInfo);
    viewer.appendChild(nodeProperties);

    if (attribute) {
        let temp = [];
        attribute = Object.entries(attribute);
        attribute.sort();
        for (i in attribute) {
            temp.push([metadata[index].attributes[i].name, metadata[index].attributes[i].type]);
        }

        temp.sort();

        const attributes = makeTitle("ATTRIBUTE");
        viewer.appendChild(attributes);
        const attributesInfo = makeArea("info");

        for (i in temp) {
            let context;
            if (temp[i][0] === "fused_activation_function") {
                context = activationFunctionType[attribute[i][1]];
            } else if (temp[i][0] === "padding") {
                context = "VALID";
            } else {
                context = attribute[i][1];
            }
            const box = makeDetailArea(temp[i][0], context, " ( type : " + temp[i][1] + " )");
            attributesInfo.appendChild(box);
        }
        attributes.appendChild(attributesInfo);
        viewer.appendChild(attributes);
    }

    if (inputs) {
        const inputsTitle = makeTitle("INPUTS");
        viewer.appendChild(inputsTitle);
        const inputsInfo = makeArea("info");
        for (i in inputs) {
            const sub = metadata[index].inputs[i].name;
            const box = makeIOArea(sub, tensors[inputs[i]]);
            inputsInfo.appendChild(box);
        }
        viewer.appendChild(inputsInfo);
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
    operatorName.addEventListener("click", () => detailPanel(i));

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
