export type Children = VNode | string | number | null;

interface VNode<Attributes = {}> {
    nodeName: string;
    attributes?: Attributes;
    children: Array<VNode | string>;
    key: string;
}

type Component<Attributes = {}> = (attributes: Attributes, children: Array<VNode | string>) => VNode<Attributes>;

type Keys = string;

type createNode = <Attributes>(nodeName: Component<Attributes> | string,
                               attributes?: Attributes | null,
                               ...children: Array<Children | Children[]>) => VNode<Attributes>;

type StyleProps = (props: any) => Styles;

interface Styles {
    [key: string]: any;
}

export const keyframes: (obj: StyleProps) => string;

export default function picostyle(vdom: createNode): (element: string | Component<object>) =>
    (styles: Styles | StyleProps) => (...children: any[]) => VNode | string | number | null;
