import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import "./App.css";
import { Code, Flex, Text, Title, Tooltip } from "@mantine/core";
import { CodeRecord, NodeInterface } from "./interfaces";

const code: CodeRecord = {
    text: "Mme Robert, 87 ans, vient ce jour pour un suivi de diabète de type 2 diagnostiqué le 24/06/2022 et une arthrite du pied.",
    Age: [
        {
            value: "87 ans",
            start: 13,
            end: 18,
            score: 0.8,
            linked_to: [],
        },
    ],
    Pathologie: [
        {
            value: "diabète de type 2",
            start: 52,
            end: 68,
            score: 0.72,
            linked_to: [
                {
                    type: "Date",
                    value: "24/06/2022",
                    start: 86,
                    end: 95,
                    score: 0.67,
                },
            ],
        },
        {
            value: "arthrite du pied",
            start: 104,
            end: 119,
            score: 0.78,
            linked_to: [],
        },
    ],
};

function App() {
    const highlightText = (json: any) => {
        let nodes: NodeInterface[] = [];

        let text = json.text;
        let keys = Object.keys(json).filter((key) => key !== "text");

        keys.forEach((key) => {
            let values = json[key];

            values.forEach((element: any, _id: any) => {
                nodes.push({
                    value: element.value,
                    confidence: element.score,
                    scope: { start: element.start, end: element.end },
                    link: element.linked_to,
                    key: key,
                    node: (
                        <Text
                            // c={"red"}
                            // fw={"bold"}
                            style={{
                                backgroundColor: "rgba(255, 0, 0, 0.1)",
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
                    ),
                });
            });
        });
        return nodes;
    };

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
    console.log("highlightText", highlightText(code));
    return (
        <>
            <Flex
                w={"100vw"}
                h={"100vh"}
                align="center"
                justify="center"
                p={64}
            >
                <Flex
                    maw={1440}
                    h={"100%"}
                    justify={"space-between"}
                    py={64}
                    bg={"#1111"}
                    style={{ borderRadius: 8 }}
                >
                    <Flex w={"45%"} direction={"column"} p={16}>
                        <Title>DATA</Title>
                        <Code p={32} m={16}>
                            {JSON.stringify(code, null, 2)}
                        </Code>
                        <Title>STRING</Title>
                        <Code p={32} m={16}>
                            {code.text as string}
                        </Code>
                        {/* <Code>{JSON.stringify(a, null, 2)}</Code> */}
                    </Flex>
                    <Flex w="fit-content">
                        <div
                            style={{
                                backgroundColor: "black",
                                height: "100%",
                                width: "1px",
                            }}
                        />
                    </Flex>
                    <Flex w={"45%"} direction={"column"}>
                        {/* <Text>
                            {highlightText(code).map((text, id) => {
                                return (
                                    <Tooltip label={text.key}>
                                        {text.node}
                                    </Tooltip>
                                );
                            })}
                        </Text> */}
                        <Text>
                            {parseText(code, highlightText(code)).map(
                                (text, id) => {
                                    console.log("text", text);
                                    if (typeof text === "string") {
                                        return text;
                                    } else {
                                        return (
                                            <Tooltip
                                                label={text.data.key}
                                                key={id + text.data.key}
                                            >
                                                {text.node}
                                            </Tooltip>
                                        );
                                    }
                                }
                            )}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
}

export default App;
