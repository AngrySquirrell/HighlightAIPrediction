import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import "./App.css";
import { Code, Flex, ScrollArea, Text, Title, Tooltip } from "@mantine/core";
import { CodeRecord, NodeInterface } from "./interfaces";
import React from "react";

const code: CodeRecord = {
    text: "Mme Robert, 87 ans, vient ce jour pour un suivi de diabète de type 2 diagnostiqué le 24/06/2022 et une arthrite du pied.",
    Age: [
        {
            value: "87 ans",
            start: 13,
            end: 18,
            score: 0.5,
            linked_to: [],
        },
    ],
    Pathologie: [
        {
            value: "diabète de type 2",
            start: 52,
            end: 68,
            score: 1,
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
            score: 0,
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
                let node = (
                    <Text
                        style={{
                            backgroundColor: `rgba(255, 100, 80, 0.25)`,
                            filter: `hue-rotate(${90 * element.score}deg)`,
                            borderRadius: 8,
                        }}
                        px={4}
                        span
                        className="nowrap"
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
                    <ScrollArea w={"48%"} h={"100%"} p={16}>
                        <Flex w={"100%"} direction={"column"}>
                            <Title>DATA</Title>
                            <Code
                                p={32}
                                m={16}
                                block
                                maw={"100%"}
                                color="dark.4"
                                c={"#fff"}
                            >
                                {JSON.stringify(code, null, 2)}
                            </Code>
                            <Title>STRING</Title>
                            <Code
                                p={32}
                                m={16}
                                maw={"100%"}
                                color="dark.4"
                                c={"#fff"}
                            >
                                {code.text as string}
                            </Code>
                            <Title>PARSED ARRAY</Title>
                            <Code
                                p={32}
                                m={16}
                                block
                                maw={"100%"}
                                color="dark.4"
                                c={"#fff"}
                            >
                                {JSON.stringify(
                                    highlightText(code).map((el, _id) => {
                                        return {
                                            ...el,
                                            node: undefined,
                                        };
                                    }),
                                    null,
                                    "\t"
                                )}
                            </Code>
                        </Flex>
                    </ScrollArea>
                    <Flex w="fit-content">
                        <div
                            style={{
                                backgroundColor: "black",
                                height: "100%",
                                width: "1px",
                            }}
                        />
                    </Flex>
                    <Flex w={"48%"} direction={"column"}>
                        <Text>
                            {parseText(code, highlightText(code)).map(
                                (text, id) => {
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
                                                                `${
                                                                    link.type
                                                                }: ${
                                                                    link.value
                                                                } ${
                                                                    link.score &&
                                                                    `(${link.score})`
                                                                }`
                                                        )
                                                        .join(", ")}`}
                                                    key={id + text.data.key}
                                                >
                                                    {text.node}
                                                </Tooltip>
                                            );
                                        return (
                                            <React.Fragment
                                                key={id + text.data.key}
                                            >
                                                {text.node}
                                            </React.Fragment>
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
