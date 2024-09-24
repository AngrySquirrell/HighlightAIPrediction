export type CodeRecord = Record<string, string | complexKey[]>;

interface complexKey {
    value: string;
    start: number;
    end: number;
    score: number;
    linked_to: linkType[];
}
interface linkType {
    type: string;
    value: string;
    start: number;
    end: number;
    score: number;
}

export interface NodeInterface {
    confidence: number;
    scope: { start: number; end: number };
    link: linkType[];
    key: string;
    node: React.ReactElement;
    value: string;
}
