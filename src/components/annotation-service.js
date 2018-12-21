import React from "react";
import { GeneSelectionForm } from "./gene-selection";
import { AnnotationSelection } from "./annotation-selection";
import { Divider, Button, Row, Icon, message } from "antd";
import * as result from "../graph.json";
import { AnnotationResultVisualizer } from "./annotation-result-visualizer";
import { AnnotationResultDownload } from "./annotation-result-download";
import {
  MAXIMUM_GRAPH_SIZE,
  MINIMAL_MODE_THRESHOLD
} from "../visualizer.config";
import { GOFilter } from "./go-filter";
import { GenePathwayFilter } from "./gene-pathway-filter";

export class AnnotationService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      genes: [],
      geneList: null,
      selectedAnnotations: [],
      annotationResult: null,
      availableAnnotations: [
        {
          name: "Gene-GO",
          key: "GO",
          defaults: {
            numberOfParents: 0
          },
          filter: (
            <GOFilter
              handleFilterChanged={filter =>
                this.handleFilterChanged("GO", filter)
              }
            />
          )
        },
        {
          name: "Gene Pathway",
          key: "genePathway",
          defaults: {},
          filter: (
            <GenePathwayFilter
              handleFilterChanged={filter =>
                this.handleFilterChanged("genePathway", filter)
              }
            />
          )
        },
        {
          name: "Biogrid protein interaction",
          key: "biogridProtienInteraction"
        }
      ]
    };
    // bind functions
    this.handleGeneAdded = this.handleGeneAdded.bind(this);
    this.handleGeneRemoved = this.handleGeneRemoved.bind(this);
    this.handleGeneListUploaded = this.handleGeneListUploaded.bind(this);
    this.handleAllGenesRemoved = this.handleAllGenesRemoved.bind(this);
    this.handleAnnotationsChanged = this.handleAnnotationsChanged.bind(this);
    this.handleFilterChanged = this.handleFilterChanged.bind(this);
  }

  handleGeneAdded(gene) {
    this.setState(state => {
      const genes = state.genes.slice(0);
      genes.push(gene);
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
      // The file is supposed to contain one gene per line. Furthermore, gene names are supposed to contain alphanumeric characters only
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

  handleAnnotationsChanged(e) {
    this.setState(state => {
      let selectedAnnotations = state.selectedAnnotations.slice();
      e.target.checked
        ? selectedAnnotations.push({ name: e.target.name, filter: {} })
        : (selectedAnnotations = selectedAnnotations.filter(
            a => a.name !== e.target.name
          ));

      return { selectedAnnotations: selectedAnnotations };
    });
  }

  handleFilterChanged(annotation, filter) {
    this.setState(state => {
      let selectedAnnotations = state.selectedAnnotations.slice();
      selectedAnnotations = selectedAnnotations.map(sa => {
        if (sa.name === annotation) {
          sa.filter = Object.assign({}, sa.filter, filter);
        }
        return sa;
      });
      return { selectedAnnotations: selectedAnnotations };
    });
  }

  isFormValid() {
    return this.state.selectedAnnotations.length && this.state.genes.length;
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  componentDidMount() {}

  downloadFile() {
    console.log("Download the file");
  }

  handleSubmit() {
    this.setState({
      annotationResult: {
        graph: result.default.graph.nodes.concat(result.default.graph.edges)
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
              onAnnotationsChanged={this.handleAnnotationsChanged}
              onAnnotationFilterChanged={this.handleAnnotationFilterChanged}
              availableAnnotations={this.state.availableAnnotations}
              selectedAnnotations={this.state.selectedAnnotations}
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
