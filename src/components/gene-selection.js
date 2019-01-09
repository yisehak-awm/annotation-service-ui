import React from "react";
import { Form, Input, Upload, Icon, Tag, Alert, Radio, Button } from "antd";

export const InputMethods = {
  DIRECT_INPUT: 1,
  FILE_UPLOAD: 2
};

export class GeneSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMethod: InputMethods.DIRECT_INPUT,
      currentGeneName: ""
    };
    this.uploaderAttributes = {
      name: "geneList",
      multiple: false,
      beforeUpload: geneList => {
        this.props.onGeneListUploaded(geneList);
        return false;
      }
    };
    this.handleGeneAdded = this.handleGeneAdded.bind(this);
  }

  handleGeneAdded() {
    if (!this.props.form.getFieldError("gene") && this.state.currentGeneName) {
      this.props.onGeneAdded(this.state.currentGeneName);
      this.props.form.setFieldsValue({ gene: "" });
      this.setState({ currentGeneName: "" });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <React.Fragment>
        <Form>
          <Form.Item>
            <Radio.Group
              id="inputMethod"
              onChange={e => this.setState({ inputMethod: e.target.value })}
              value={this.state.inputMethod}
            >
              <Radio value={InputMethods.DIRECT_INPUT}>Input directly</Radio>
              <Radio value={InputMethods.FILE_UPLOAD}>Import from file</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>

        {this.state.inputMethod === InputMethods.DIRECT_INPUT && (
          <Form id="directInputForm">
            <Form.Item label="Gene name" style={{ marginBottom: "0" }}>
              {getFieldDecorator("gene", {
                rules: [
                  { required: true, message: "Please input gene name!" },
                  {
                    validator: (rule, value, callback) => {
                      if (this.props.genes.indexOf(value) !== -1) {
                        callback("This gene name is already added.");
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Input
                  suffix={<Icon type="enter" />}
                  placeholder="Input gene name and hit enter"
                  onChange={e =>
                    this.setState({ currentGeneName: e.target.value.trim() })
                  }
                  onPressEnter={() => {
                    this.handleGeneAdded();
                  }}
                />
              )}
            </Form.Item>
          </Form>
        )}

        {this.state.inputMethod === InputMethods.FILE_UPLOAD && (
          <React.Fragment>
            <Upload.Dragger {...this.uploaderAttributes} fileList={[]}>
              <p className="ant-upload-drag-icon">
                <Icon type="import" />
              </p>
              <p className="ant-upload-text">
                Click here or drag file containing list of genes.
              </p>
              <p className="ant-upload-hint">
                Please make sure the file is a plain text file containing a gene
                name per line.
              </p>
            </Upload.Dragger>

            {this.props.geneList && this.props.genes.length ? (
              <Alert
                className="fileDetails"
                style={{
                  borderRadius: 0,
                  borderTop: "none",
                  position: "relative",
                  bottom: "2px"
                }}
                message={
                  this.props.geneList.name +
                  " ( " +
                  this.props.geneList.size / 1000000 +
                  " MB )"
                }
                type="info"
              />
            ) : null}
          </React.Fragment>
        )}

        <div style={{ marginTop: "10px" }}>
          <h4 style={{ color: "#82909d", marginBottom: "5px" }}>
            {" "}
            Selected genes
            {this.props.genes.length ? (
              <Button
                onClick={e => this.props.onAllGenesRemoved()}
                type="danger"
                ghost
                style={{ border: "none" }}
              >
                {" "}
                Remove all
              </Button>
            ) : null}
          </h4>
          {!this.props.genes.length ? (
            <Alert
              id="noGenesAlert"
              type="warning"
              description="The genes you input appear here. You may input gene names directly or import them from file."
            />
          ) : null}

          {this.props.genes.length
            ? this.props.genes.map(gene => (
                <Tag
                  style={{ marginBottom: "5px" }}
                  onClose={() => this.props.onGeneRemoved(gene)}
                  key={gene}
                  closable
                  color="blue"
                >
                  {" "}
                  {gene}{" "}
                </Tag>
              ))
            : null}
        </div>
      </React.Fragment>
    );
  }
}

export const GeneSelectionForm = Form.create()(GeneSelection);
