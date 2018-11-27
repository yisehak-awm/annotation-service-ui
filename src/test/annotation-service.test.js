import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { AnnotationService } from '../annotation-service'
import renderer from 'react-test-renderer';

configure({ adapter: new Adapter() });


describe('<AnnotationService />', () => {

    it('renders correctly', () => {
        const tree = renderer.create(<AnnotationService />).toJSON()
        expect(tree).toMatchSnapshot()
    });


    it('renders a disabled submit button on mount', () => {
        const wrapper = shallow(<AnnotationService />)
        expect(wrapper.find('Button#submit[disabled=true]').exists()).toBeTruthy()
    })


    it('enables submit button once genes and annotations are selected', () => {
        const wrapper = shallow(<AnnotationService />)
        expect(wrapper.find('Button#submit[disabled=true]').exists()).toBeTruthy()
        wrapper.setState({ selectedAnnotations: [{ name: 'a', filter: {} }], genes: ['ACP1'] })
        expect(wrapper.find('Button#submit[disabled=false]').exists()).toBeTruthy()
    })


})