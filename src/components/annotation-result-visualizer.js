import React from "react";
import {
  Alert,
  Collapse,
  Checkbox,
  Row,
  Col,
  Button,
  Icon,
  Tooltip,
  Progress
} from "antd";
import * as cytoscape from "cytoscape";
import { CYTOSCAPE_COLA_CONFIG, CYTOSCAPE_STYLE } from "../visualizer.config";
import * as cola from "cytoscape-cola";
import coseBilkent from "cytoscape-cose-bilkent";
const AnnotationColorsLight = [
  "#C1CEE8",
  "#DAD3B0",
  "#E0D0E3",
  "#C8DECC",
  "#b7defa",
  "#d6a8b7"
];
const AnnotationColorsDark = [
  "#587bc1",
  "#b6a863",
  "#a06fa9",
  "#70a97a",
  "#24a5f5",
  "#b5637e"
];

export class AnnotationResultVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNode: { node: null, position: null },
      history: []
    };

    this.cy_wrapper = React.createRef();
    cytoscape.use(cola);
    // cytoscape.use(coseBilkent);
  }

  changeLayout() {
    this.layout = !this.props.minimalMode
      ? this.cy.layout(CYTOSCAPE_COLA_CONFIG)
      : this.cy.layout({ name: "cose" });
    // this.layout = this.cy.layout(defaultOptions);
    this.layout.run();
  }

  takeScreenshot() {
    const image = this.cy.jpg();
    const link = document.createElement("a");
    link.setAttribute("href", image);
    link.setAttribute("download", "mozi-graph.jpg");
    link.click();
  }

  componentDidMount() {
    this.cy = cytoscape({
      container: this.cy_wrapper.current,
      hideEdgesOnViewport: true
    });
    this.cy.add(
      this.props.graph.nodes.filter(n => n.data.group === "main" && n.data.id)
    );
    this.toggleAnnotationVisibility(this.props.annotations[0], true);
    this.cy.style(
      !this.props.minimalMode
        ? CYTOSCAPE_STYLE.concat(this.assignColorToAnnotations())
        : CYTOSCAPE_STYLE
    );
    this.registerEventListeners();
    this.changeLayout();
  }

  registerEventListeners() {
    this.cy.nodes().on(
      "mouseover",
      function(event) {
        console.log(event);
        this.setState({
          selectedNode: {
            node: event.target.data(),
            position: event.renderedPosition
          }
        });
      }.bind(this)
    );
    this.cy.nodes().on(
      "select",
      function(event) {
        this.focusOnNode(event.target.data().id);
      }.bind(this)
    );
    this.cy.nodes().on(
      "mouseout",
      function(event) {
        this.setState({ selectedNode: { node: null, position: null } });
      }.bind(this)
    );
    this.cy.nodes().on(
      "unselect",
      function(event) {
        this.removeFocus();
      }.bind(this)
    );
  }

  removeFocus() {
    this.cy.batch(() => {
      this.cy.elements().style({ opacity: 1 });
    });
  }

  assignColorToAnnotations() {
    return this.props.annotations.reduce((acc, ann, i, arr) => {
      acc.push({
        selector: 'edge[group="' + ann + '"]',
        style: {
          "line-color": AnnotationColorsLight[i],
          "text-outline-color": AnnotationColorsLight[i]
        }
      });
      acc.push({
        selector: 'node[group="' + ann + '"]',
        style: {
          "background-color": AnnotationColorsDark[i],
          color: "#fff",
          "text-outline-width": 2,
          "text-outline-color": AnnotationColorsDark[i]
        }
      });
      return acc;
    }, []);
  }

  focusOnNode(id) {
    const hood = this.cy.getElementById(id).closedNeighborhood();
    this.cy.fit(hood);
    this.cy.batch(() => {
      this.cy
        .elements()
        .difference(hood)
        .style({ opacity: 0.1 });
    });
  }

  downloadGraphJSON() {
    const json = `data:text/json;charset=utf-8, ${encodeURIComponent(
      JSON.stringify(this.props.graph)
    )}`;
    const link = document.createElement("a");
    link.setAttribute("href", json);
    link.setAttribute("download", "annotation-graph.json");
    link.click();
  }

  toggleAnnotationVisibility(annotation, show) {
    show
      ? this.cy.batch(() => {
          this.cy.add(
            this.props.graph.nodes.filter(
              e => e.data.group === annotation && e.data.id
            )
          );
          this.cy.add(
            this.props.graph.edges.filter(
              e => e.data.group === annotation && e.data.source && e.data.target
            )
          );
        })
      : this.cy.remove(`[group='${annotation}']`);
    this.changeLayout();
    this.registerEventListeners();
  }

  annotationPercentage(annotation) {
    return (
      (100 *
        this.props.graph.edges.filter(e => e.data.group === annotation)
          .length) /
      this.props.graph.edges.length
    );
  }

  render() {
    return (
      <div
        style={{
          minHeight: "90vh"
        }}
      >
        <Row>
          <Col
            span={1}
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              zIndex: 2
            }}
          >
            <Button.Group
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                borderRadius: "5px"
              }}
              size="large"
            >
              <Tooltip placement="right" title="Change layout">
                <Button
                  onClick={e => this.changeLayout()}
                  style={{ border: "none" }}
                >
                  <Icon type="swap" />
                </Button>
              </Tooltip>
              <Tooltip placement="right" title="Save screenshot">
                <Button
                  onClick={e => this.takeScreenshot()}
                  style={{ border: "none" }}
                >
                  <Icon type="camera" />
                </Button>
              </Tooltip>

              {this.state.history.length > 0 && (
                <Tooltip placement="right" title="Undo">
                  <Button
                    style={{ border: "none", borderRadius: "0" }}
                    onClick={e => this.undo()}
                  >
                    <Icon type="undo" />
                  </Button>
                </Tooltip>
              )}

              <Tooltip placement="right" title="Download scheme file">
                <Button
                  onClick={e => this.props.downloadSchemeFile()}
                  style={{ border: "none", borderRadius: "0" }}
                >
                  <Icon type="file-text" />
                </Button>
              </Tooltip>
              <Tooltip placement="right" title="Download graph as JSON">
                <Button
                  onClick={e => this.downloadGraphJSON()}
                  style={{ border: "none", borderRadius: "0" }}
                >
                  <Icon type="share-alt" />
                </Button>
              </Tooltip>
              <Tooltip
                placement="right"
                title={
                  <div>
                    <p>
                      Use the checkboxes to the right to filter the graph by
                      annotations.
                    </p>
                    <p>Click on a gene node to see its annotations.</p>
                  </div>
                }
              >
                <Button style={{ border: "none", borderRadius: "0" }}>
                  <Icon type="info-circle" />
                </Button>
              </Tooltip>
            </Button.Group>
          </Col>
          <Col span={24}>
            <div
              style={{
                minHeight: "100vh"
              }}
              ref={this.cy_wrapper}
            />
          </Col>
          <Col
            span={4}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              backgroundColor: "#fff",
              borderRadius: "5px",
              zIndex: 2
            }}
          >
            <Collapse
              accordion
              bordered={false}
              defaultActiveKey="2"
              style={{
                background: "none"
              }}
            >
              <Collapse.Panel
                header="Annotations"
                key="2"
                style={{ borderBottom: "none" }}
              >
                {this.props.annotations.map((a, i) => (
                  <React.Fragment key={a}>
                    <Checkbox
                      defaultChecked={i === 0}
                      onChange={e =>
                        this.toggleAnnotationVisibility(a, e.target.checked)
                      }
                    >
                      {a}
                    </Checkbox>
                    <Progress
                      strokeColor={AnnotationColorsLight[i]}
                      percent={this.annotationPercentage(a)}
                      showInfo={false}
                      size="small"
                    />
                  </React.Fragment>
                ))}
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>
        {this.state.selectedNode.node && (
          <Alert
            style={{
              position: "absolute",
              top: `${this.state.selectedNode.position.y}px`,
              left: `${this.state.selectedNode.position.x}px`,
              width: "350px",
              backgroundColor: "#c9e1f9",
              border: "solid 1px #87BEF5"
            }}
            message={`${this.state.selectedNode.node.name} ( ${
              this.state.selectedNode.node.id
            } )`}
            description={this.state.selectedNode.node.definition}
            closable
            onClose={() => {}}
          />
        )}
      </div>
    );
  }
}

var defaultOptions = {
  name: "cose-bilkent",
  // Called on `layoutready`
  ready: function() {},
  // Called on `layoutstop`
  stop: function() {},
  // Whether to include labels in node dimensions. Useful for avoiding label overlap
  nodeDimensionsIncludeLabels: false,
  // number of ticks per frame; higher is faster but more jerky
  refresh: 30,
  // Whether to fit the network view after when done

  // Padding on fit
  padding: 10,
  // Whether to enable incremental mode
  randomize: true,
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: 4500,
  // Ideal (intra-graph) edge length
  idealEdgeLength: 50,
  // Divisor to compute edge forces
  edgeElasticity: 0.45,
  // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
  nestingFactor: 0.1,
  // Gravity force (constant)
  gravity: 0.25,
  // Maximum number of iterations to perform
  numIter: 2500,
  // Whether to tile disconnected nodes
  tile: true,
  // Type of layout animation. The option set is {'during', 'end', false}
  animate: "end",
  // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
  tilingPaddingVertical: 10,
  // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
  tilingPaddingHorizontal: 10,
  // Gravity range (constant) for compounds
  gravityRangeCompound: 1.5,
  // Gravity force (constant) for compounds
  gravityCompound: 1.0,
  // Gravity range (constant)
  gravityRange: 3.8,
  // Initial cooling factor for incremental layout
  initialEnergyOnIncremental: 0.5
};
