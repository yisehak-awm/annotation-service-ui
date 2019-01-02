import "../node_modules/antd/dist/antd.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { AnnotationService } from "./components/annotation-service";
import { GOFilter } from "./components/go-filter";
import { GenePathwayFilter } from "./components/gene-pathway-filter";

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
      get_entrez_id: false,
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
      namespace: ["SMPDB"],
      include_prot: false,
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
    key: "biogridProteinInteraction",
    name: "Biogrid protein interaction",
    fitlerForm: (defaults, handleFilterChanged) => null
  }
];

class App extends React.Component {
  render() {
    return (
      <div>
        <AnnotationService availableAnnotations={availableAnnotations} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
