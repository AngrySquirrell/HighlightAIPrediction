// @ts-nocheck
// TS
// Refactorized data takes the shape :
export interface NodeInterface {
    confidence: number;
    scope: { start: number; end: number };
    link: linkType[];
    key: string;
    node: React.ReactElement;
    value: string;
}

// Refactorizes the data to slice it
const highlightText = (json: any) => {
    let nodes: NodeInterface[] = [];

    let text = json.text;
    let keys = Object.keys(json).filter((key) => key !== "text");

    keys.forEach((key) => {
        let values = json[key];

        values.forEach((element: any, _id: any) => {
            let node = (
                <Text
                    style={{
                        backgroundColor: `rgba(255, 100, 80, 0.25)`,
                        filter: `hue-rotate(${90 * element.score}deg)`,
                        borderRadius: 8,
                    }}
                    px={4}
                    span
                >
                    {text.slice(element.start - 1, element.end)}
                    <Text span c={"grey"} fz={10} px={2}>
                        {key}: {element.score}
                    </Text>
                </Text>
            );
            nodes.push({
                value: element.value,
                confidence: element.score,
                scope: { start: element.start, end: element.end },
                link: element.linked_to,
                key: key,
                node,
            });
        });
    });
    return nodes;
};

// Slices the text, injects the nodes and returns the array
// => [string, <>node</>, string, <>node</>, string, <>node</>, string]
const parseText = (json: any, nodes: NodeInterface[]) => {
    let text = json.text;
    let lastEnd = 0;
    let arr: any[] = [];
    nodes.forEach((node, id) => {
        let {
            value: _value,
            scope,
            link: _link,
            key: _key,
            node: element,
        } = node;
        let { start, end } = scope;

        let before = text.slice(lastEnd, start - 1);
        arr.push(before);
        arr.push({ data: node, node: element });
        if (id === nodes.length - 1) {
            let after = text.slice(end);

            arr.push(after);
        }
        lastEnd = end;
    });
    console.log("arr", arr);
    return arr;
};

// TSX
{
    parseText(code, highlightText(code)).map((text, id) => {
        console.log("text", text);
        if (typeof text === "string") {
            return text;
        } else {
            if (text.data.link.length > 0)
                return (
                    <Tooltip
                        label={`${text.data.link
                            .map(
                                (link: any) =>
                                    `${link.type}: ${link.value} ${
                                        link.score && `(${link.score})`
                                    }`
                            )
                            .join(", ")}`}
                        key={id + text.data.key}
                    >
                        {text.node}
                    </Tooltip>
                );
            return (
                <React.Fragment key={id + text.data.key}>
                    {text.node}
                </React.Fragment>
            );
        }
    });
}
