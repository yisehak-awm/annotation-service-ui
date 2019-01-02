import React from "react";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { GeneSelectionForm } from "../components/gene-selection";
import renderer from "react-test-renderer";

configure({ adapter: new Adapter() });

describe("<GeneSelectionForm />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<GeneSelectionForm genes={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows direct input form initially", () => {
    const wrapper = mount(<GeneSelectionForm genes={[]} />);
    expect(wrapper.find("#directInputForm").exists()).toBeTruthy();
  });

  it("shows an alert message for empty gene list", () => {
    const wrapper = mount(<GeneSelectionForm genes={[]} />);
    expect(wrapper.find("Alert#noGenesAlert").exists()).toBeTruthy();
  });

  it("renders a list item for each inserted gene", () => {
    const wrapper = mount(<GeneSelectionForm genes={["G1", "G2", "G3"]} />);
    expect(wrapper.find("Tag").length).toEqual(3);
  });
});
