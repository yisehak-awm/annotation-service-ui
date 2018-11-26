import React from 'react';
import { Form, Radio, Checkbox } from 'antd';


export class AnnotationSelection extends React.Component {

    render() {
        return (
            <React.Fragment>
                <h4 style={{ marginBottom: '15px' }}>Annotations: </h4>
                {
                    this.props.availableAnnotations.map((annotation, index) =>
                        <div key={annotation}>
                            <Checkbox name={annotation} onChange={e => this.props.onAnnotationsChanged(e)}> {annotation} </Checkbox>
                            {this.props.selectedAnnotations.some(a => a.name === annotation) &&
                                <Form style={{ paddingLeft: '25px', marginBottom: '30px', marginLeft: '5px', paddingTop: '15px', borderLeft: 'dashed 1px #ddd' }} layout='inline'>
                                    <h3>{annotation} Filters</h3>
                                    <Radio.Group name='option' onChange={e => this.props.onAnnotationFilterChanged(annotation, e)}>
                                        <Radio value={1}> Option One </Radio>
                                        <Radio value={2}> Option Two </Radio>
                                        <Radio value={3}> Option Three </Radio>
                                    </Radio.Group>
                                </Form>}
                        </div>
                    )
                }

            </React.Fragment>
        )
    }

}