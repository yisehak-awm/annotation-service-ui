import {
  MAXIMUM_GRAPH_SIZE,
  MINIMAL_MODE_THRESHOLD
} from "../visualizer.config";
import React from "react";
import { SERVER_ADDRESS } from "../utils";
import { Annotate } from "../proto/annotation_pb_service";
import {
  AnnotationRequest,
  Annotation,
  Gene,
  Filter
} from "../proto/annotation_pb";
import { grpc } from "grpc-web-client";
import { GeneSelectionForm } from "./gene-selection";
import { AnnotationSelection } from "./annotation-selection";
import { Divider, Button, Row, Icon, message } from "antd";
import { AnnotationResultVisualizer } from "./annotation-result-visualizer";
import { AnnotationResultDownload } from "./annotation-result-download";

export class AnnotationService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      genes: [],
      geneList: null,
      selectedAnnotations: [],
      annotationResult: null,
      busy: false
    };
    // bind functions
    this.handleGeneAdded = this.handleGeneAdded.bind(this);
    this.handleGeneRemoved = this.handleGeneRemoved.bind(this);
    this.handleGeneListUploaded = this.handleGeneListUploaded.bind(this);
    this.handleAllGenesRemoved = this.handleAllGenesRemoved.bind(this);
    this.handleAnnotationsChanged = this.handleAnnotationsChanged.bind(this);
    this.handleFilterChanged = this.handleFilterChanged.bind(this);
  }

  handleGeneAdded(input) {
    this.setState(state => {
      let genes = state.genes.slice(0);
      genes = [...genes, ...input.trim().split(" ")];
      return { genes: genes };
    });
  }

  handleGeneRemoved(gene) {
    this.setState(state => {
      let genes = state.genes.slice(0);
      return { genes: genes.filter(g => g !== gene) };
    });
  }

  handleGeneListUploaded(geneList) {
    const fileReader = new FileReader();
    fileReader.readAsText(geneList);
    fileReader.onload = () => {
      const re = /^[a-z0-9\s]+$/i;
      if (!re.test(fileReader.result)) {
        message.error("The selected file contains invalid characters.");
        return;
      }
      const geneArray = fileReader.result.split("\n");
      const uniqueGeneArray = geneArray.reduce((accumulator, value) => {
        if (value && accumulator.indexOf(value) === -1) accumulator.push(value);
        return accumulator;
      }, []);
      this.setState({ geneList: geneList, genes: uniqueGeneArray });
    };
  }

  handleAllGenesRemoved() {
    this.setState({ genes: [], geneList: null });
  }

  handleAnnotationsChanged(isSelected, annotation) {
    this.setState(state => {
      let selectedAnnotations = state.selectedAnnotations.slice();
      isSelected
        ? selectedAnnotations.push({
            name: annotation,
            filter: this.props.availableAnnotations.find(
              a => a.key === annotation
            ).defaults
          })
        : (selectedAnnotations = selectedAnnotations.filter(
            a => a.name !== annotation
          ));

      return { selectedAnnotations: selectedAnnotations };
    });
  }

  handleFilterChanged(annotation, filter) {
    this.setState(state => {
      const selectedAnnotations = state.selectedAnnotations.map(sa => {
        if (sa.name === annotation) {
          sa.filter = Object.assign({}, sa.filter, filter);
        }
        return sa;
      });
      return { selectedAnnotations: selectedAnnotations };
    });
  }

  isFormValid() {
    let valid = true;
    valid = valid && this.state.selectedAnnotations.length;
    valid = valid && this.state.genes.length;

    const GO = this.state.selectedAnnotations.find(
      a => a.name === "gene_go_annotation"
    );
    if (GO) valid = valid && GO.filter.namespace.length;
    return valid;
  }

  componentDidUpdate() {}

  downloadFile() {
    console.log("Download the file");
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleSubmit() {
    const annotationResult = new AnnotationRequest();
    annotationResult.setGenesList(
      this.state.genes.map(g => {
        const gene = new Gene();
        gene.setGeneName(g);
        return gene;
      })
    );
    annotationResult.setAnnotationsList(
      this.state.selectedAnnotations.map(sa => {
        const annotation = new Annotation();
        annotation.setFunctionName(sa.name);
        annotation.setFiltersList(
          sa.filter
            ? Object.keys(sa.filter).map(k => {
                const filter = new Filter();
                filter.setFilter(k);
                filter.setValue(
                  Array.isArray(sa.filter[k])
                    ? sa.filter[k]
                        .reduce((acc, value) => {
                          return acc + " " + value;
                        }, "")
                        .trim()
                    : this.capitalizeFirstLetter(sa.filter[k].toString())
                );
                return filter;
              })
            : []
        );
        return annotation;
      })
    );

    this.setState({ busy: true });
    const hideLoader = message.loading("Fetching annotation results ...", 0);
    grpc.unary(Annotate.Annotate, {
      request: annotationResult,
      host: SERVER_ADDRESS,
      onEnd: res => {
        hideLoader();
        if (res.status === grpc.Code.OK) {
          this.setState(state => ({
            busy: false,
            annotationResult: { graph: JSON.parse(res.message.array[0]) }
          }));
        } else {
          if (res.statusMessage.includes("Gene Does't exist")) {
            const invalidGenes = res.statusMessage
              .split("`")[1]
              .split(",")
              .map(g => g.trim())
              .filter(g => g);
            this.setState(state => ({
              busy: false,
              genes: state.genes.filter(g => !invalidGenes.includes(g))
            }));
          } else {
            this.setState(state => ({
              busy: false
            }));
          }

          message.error(res.statusMessage, 5);
        }
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        {!this.state.annotationResult && (
          <div style={{ padding: "30px 150px" }}>
            <GeneSelectionForm
              genes={this.state.genes}
              geneList={this.state.geneList}
              onGeneAdded={this.handleGeneAdded}
              onGeneRemoved={this.handleGeneRemoved}
              onGeneListUploaded={this.handleGeneListUploaded}
              onAllGenesRemoved={this.handleAllGenesRemoved}
            />
            <Divider dashed />
            <AnnotationSelection
              handleAnnotationsChanged={this.handleAnnotationsChanged}
              handleFilterChanged={this.handleFilterChanged}
              selectedAnnotations={this.state.selectedAnnotations}
              availableAnnotations={this.props.availableAnnotations}
            />
            <Divider dashed />
            <Row type="flex" justify="end">
              <Button
                id="submit"
                type="primary"
                disabled={!this.isFormValid()}
                onClick={() => this.handleSubmit()}
              >
                <Icon type="check" />
                Submit
              </Button>
            </Row>
          </div>
        )}
        {this.state.annotationResult ? (
          this.state.annotationResult.graph.nodes.length <
          MAXIMUM_GRAPH_SIZE ? (
            <AnnotationResultVisualizer
              annotations={this.state.selectedAnnotations.map(a => a.name)}
              graph={this.state.annotationResult.graph}
              downloadFile={this.downloadFile}
              minimalMode={
                this.state.annotationResult.graph.nodes.length +
                  this.state.annotationResult.graph.edges.length >
                MINIMAL_MODE_THRESHOLD
              }
            />
          ) : (
            <AnnotationResultDownload downloadFile={this.downloadFile} />
          )
        ) : null}
      </React.Fragment>
    );
  }
}
