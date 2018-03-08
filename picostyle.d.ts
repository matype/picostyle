export type Children = VNode | string | number | null;

interface VNode<Attributes = {}> {
    nodeName: string
    attributes?: Attributes
    children: Array<VNode | string>
    key: string
}

interface Component<Attributes = {}> {
    (attributes: Attributes, children: Array<VNode | string>): VNode<Attributes>
}

type Keys = string;

type createNode = <Attributes>(nodeName: Component<Attributes> | string, attributes?: Attributes | null,
    ...children: Array<Children | Children[]>) => VNode<Attributes>

type StyleProps = (props: any) => IStyles;

interface IStyles {
    [key: string]: any;
}

export function picostyle(vdom: createNode): (element: string | Component<Object>) =>
    (styles: IStyles | StyleProps) => (...children: any[]) => VNode | string | number | null
