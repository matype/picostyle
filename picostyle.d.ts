export type Children = VNode | string | number | null;

interface VNode<Attributes = {}> {
  nodeName: string;
  attributes?: Attributes;
  children: Array<VNode | string>;
  key: string;
}

type Component<Attributes = {}> = (
  attributes: Attributes,
  children: Array<VNode | string>,
) => VNode<Attributes>;

type Keys = string;

export interface PicoOption {
  returnObject: boolean;
}

export interface PicoObject {
  style: StyleFunction;
  css: CSSFunction;
}

export type StyleFunction = (
  element: string | Component<object>,
) => (
    styles: Styles | StyleProps,
  ) => (...children: any[]) => VNode | string | number | null;

export type CSSFunction = (styles: Styles) => string;

type createNode = <Attributes>(
  nodeName: Component<Attributes> | string,
  attributes?: Attributes | null,
  ...children: Array<Children | Children[]>
) => VNode<Attributes>;

type StyleProps = (props: any) => Styles;

interface Styles {
  [key: string]: any;
}

export const keyframes: (obj: StyleProps) => string;

export default function picostyle(
  vdom: createNode,
  picoOption?: PicoOption,
): StyleFunction | PicoObject;
