import {h} from "ultradom";
import picostyle from "../..";

const style = picostyle(h);

const Wrapper = style("div")({
    background: "#000",
    minHeight: "100vh",
});

const Component = (text: any) => h("h1", {}, text);
const Text = style(Component)({
    color: "#fff",
});

const Button = style("button")((props) => ({
    color: props.color,
}));

const App = h("main", null,
    Wrapper({}, Text("Scoping CSS is hard")),
    Wrapper({}, Text("Not with styled components!")),
    Wrapper({color: "red"}, Button("I'm red!")),
);
