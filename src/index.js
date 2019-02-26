import React from "react";
import ReactDOM from "react-dom";
import { AnnotationService } from "./components/annotation-service";
import { GOFilter } from "./components/go-filter";
import { GenePathwayFilter } from "./components/gene-pathway-filter";
import "./style.css";

const availableAnnotations = [
  {
    key: "gene_go_annotation",
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
    key: "gene_pathway_annotation",
    name: "Gene pathway",
    defaults: {
      namespace: ["smpdb"],
      include_prot: false,
      include_small_molecule: true
    },
    fitlerForm: (defaults, handleFilterChanged) => (
      <GenePathwayFilter
        defaults={defaults}
        handleFilterChanged={handleFilterChanged}
      />
    )
  },
  {
    key: "biogrid_interaction_annotation",
    name: "Biogrid protein interaction",
    fitlerForm: (defaults, handleFilterChanged) => null
  }
];

class App extends React.Component {
  render() {
    return <AnnotationService availableAnnotations={availableAnnotations} />;
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
