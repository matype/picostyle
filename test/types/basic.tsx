import {h, patch} from "ultradom";
import picostyle from "../../";

const ps = picostyle(h);

function view(state: any) {
  const keyColor = "#f07";

  const Text = ps("h1")({
    ":hover": {
        transform: "scale(1.3)",
    },
    "@media (max-width: 450px)": {
        fontSize: "32px",
    },
    "color": "#fff",
    "cursor": "pointer",
    "fontSize": "64px",
    "padding": "0.4em",
    "transition": "all .2s ease-in-out",
  });

  const Wrapper = ps("div")({
    alignItems: "center",
    backgroundColor: keyColor,
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    width: "100vw",
  });

  return (
    <Wrapper>
      <Text>{state.trim() === "" ? ":)" : state}</Text>
    </Wrapper>
  );
}

document.body.appendChild(patch(view("Hello, Picostyle")));
