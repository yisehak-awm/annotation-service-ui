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
const AnnotationColors = [
  "#C1CEE8",
  "#DAD3B0",
  "#E0D0E3",
  "#C8DECC",
  "#8FE08F",
  "#45aaf2",
  "#12CBC4"
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
  }

  changeLayout() {
    this.layout = !this.props.minimalMode
      ? this.cy.layout(CYTOSCAPE_COLA_CONFIG)
      : this.cy.layout({ name: "cose" });
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
    // this.cy.add(this.props.graph.nodes.filter(n => n.data.group === "main"));
    this.cy.add(this.props.graph);

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
        style: { "line-color": AnnotationColors[i] }
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
    console.log(annotation);
    show
      ? this.cy.batch(() => {
          this.cy.add(
            this.props.graph.nodes.filter(e => e.data.group === annotation)
          );
          this.cy.add(
            this.props.graph.edges.filter(e => e.data.group === annotation)
          );
        })
      : this.cy.remove(`[group='${annotation}']`);
    this.changeLayout();
    this.registerEventListeners();
  }

  annotationPercentage(annotation) {
    return 100;
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
            <Button
              style={{ marginBottom: "15px" }}
              onClick={() => this.props.back()}
            >
              <Icon type="left" />
              back
            </Button>
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
                      // style={
                      //   this.props.minimalMode
                      //     ? {}
                      //     : { backgroundColor: AnnotationColors[i] }
                      // }
                      defaultChecked={i === 0}
                      onChange={e =>
                        this.toggleAnnotationVisibility(a, e.target.checked)
                      }
                    >
                      {a}
                    </Checkbox>
                    <Progress
                      strokeColor={AnnotationColors[i]}
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
