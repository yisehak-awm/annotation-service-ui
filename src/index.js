import React from "react";
import ReactDOM from "react-dom";
import { AnnotationService } from "./components/annotation-service";
import { GOFilter } from "./components/go-filter";
import { GenePathwayFilter } from "./components/gene-pathway-filter";
import "./style.css";

var availableAnnotations = [
  {
    key: "gene-go-annotation",
    name: "Gene-GO",
    defaults: {
      namespace: [
        "biological_process",
        "cellular_component",
        "molecular_function"
      ],
      parents: 0
    },
    fitlerForm: (defaults, handleFilterChanged) => (
      <GOFilter defaults={defaults} handleFilterChanged={handleFilterChanged} />
    )
  },
  {
    key: "gene-pathway-annotation",
    name: "Gene pathway",
    defaults: {
      namespace: ["reactome"],
      include_prot: true,
      include_small_molecule: false
    },
    fitlerForm: (defaults, handleFilterChanged) => (
      <GenePathwayFilter
        defaults={defaults}
        handleFilterChanged={handleFilterChanged}
      />
    )
  },
  {
    key: "biogrid-interaction-annotation",
    name: "Biogrid protein interaction",
    fitlerForm: (defaults, handleFilterChanged) => null,
    defaults: {
      interaction: "genes"
    }
  }
];

class App extends React.Component {

  render() {
    return <AnnotationService availableAnnotations={availableAnnotations}/>;
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
