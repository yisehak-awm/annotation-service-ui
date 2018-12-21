export const MAXIMUM_GRAPH_SIZE = 2000;
export const MINIMAL_MODE_THRESHOLD = 2000;

export const CYTOSCAPE_COLA_CONFIG = {
  name: "cola",
  animate: false,
  maxSimulationTime: 500,
  ungrabifyWhileSimulating: true,
  fit: true,
  padding: 10,
  randomize: true,
  avoidOverlap: true,
  handleDisconnected: true,
  nodeSpacing: 30,
  infinite: false
};

export const CYTOSCAPE_STYLE = [
  // Node styles
  {
    selector: "node",
    css: {
      shape: "round-rectangle",
      width: "mapData(name.length, 0, 65, 50, 500)",
      height: "40",
      content: "data(name)",
      color: "#fff",
      "text-wrap": "wrap",
      "text-max-width": "350px",
      "text-valign": "center",
      "text-halign": "center",
      "background-color": "#565656",
      "text-outline-color": "#565656",
      "text-outline-width": 1
    }
  },
  {
    selector: "node:selected",
    css: {
      "border-width": 5,
      "border-color": "#AAD8FF",
      "border-opacity": 1
    }
  },
  {
    selector: 'node[group="Gene"]',
    style: {
      shape: "ellipse",
      width: 75,
      height: 75,
      color: "#fff",
      "background-color": "#005bcd"
    }
  },
  {
    selector: 'node[group="main"]',
    style: {
      shape: "ellipse",
      width: 75,
      height: 75,
      color: "#fff",
      "background-color": "#005bcd"
    }
  },
  // Edge styles
  {
    selector: "edge",
    css: {
      "curve-style": "haystack",
      "line-color": "#ccc",
      width: 6,
      "overlay-padding": 3
    }
  }
];
