import React, {Component, useEffect} from 'react';
import Form from "@rjsf/core";
import './styles.css';

class App extends Component {

    mustacheTemplate = "";

    constructor(props) {
        super(props);

        //const Form = JSONSchemaForm.default;

        this.state = {
            subject: '',
            readmeOut: '',
            schema: {},
            defaultValues: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        var md = require('markdown-it')({
            html: true
        });

        fetch("https://raw.githubusercontent.com/madushadhanushka/github-readme/main/templates/simple/readme.mustache")
            .then(res => res.text())
            .then(
                (mustacheTemplate) => {
                    this.getSchema(mustacheTemplate);
                    //this.setState({readmeOut: result});
                },
                (error) => {
                    console.error("Error fetching mustache", error);
                }
            );


        var result = md.render('# markdown-it rulezz! <br> ## abc');


        //this.setState({schema: schema, subject:result, defaultValues: defaultValues});

    }

    getSchema = (template) => {
        fetch("https://raw.githubusercontent.com/madushadhanushka/github-readme/main/templates/simple/schema.json")
            .then(res => res.json())
            .then(
                (schema) => {
                    //console.log(template, schema);
                    schema.title = "Readme Inputs";
                    schema.description = "Insert your details in here to generate Readme file";
                    this.updateWithMustache(template, schema);

                },
                (error) => {
                    console.error("Error fetching mustache", error);
                }
            );
    };


    updateWithMustache = (template, schema) => {
        fetch("https://raw.githubusercontent.com/madushadhanushka/github-readme/main/templates/simple/default.json")
            .then(res => res.json())
            .then(
                (defaultValues) => {
                    var Mustache = require('mustache');

                    var mdOut = Mustache.render(template, defaultValues);
                    this.mustacheTemplate = template;
                    //console.log(mdOut);
                    this.setState({readmeOut: mdOut,schema: schema, defaultValues: defaultValues});
                    this.updateHTMLOut(mdOut);
                },
                (error) => {
                    console.error("Error fetching mustache", error);
                }
            );
    };

    updateHTMLOut = (content) => {
        var md = require('markdown-it')({
            html: true
        });
        var result = md.render(content);
        this.setState({subject: result});
    };

    handleChange(event) {
        this.setState({readmeOut: event.target.value});
        this.updateHTMLOut(event.target.value);
    }

    handleSubmit(event) {
        var Mustache = require('mustache');
        console.log("A name was submitted: " , event.formData);
        var mdOut = Mustache.render(this.mustacheTemplate, event.formData);
        this.setState({readmeOut: mdOut, defaultValues: event.formData});
        this.updateHTMLOut(mdOut);
    }

    render() {
        const uiSchema = {
            classNames: "custom-css-class"
        };

        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-sm content_padding">
                            <ul className="nav nav-tabs">
                                <li className="active"><a data-toggle="tab" href="#input_form">Input value</a></li>
                                <li><a data-toggle="tab" href="#MD_output">MD output</a></li>
                            </ul>
                            <div className="tab-content content_padding">
                                <div id="input_form" className="tab-pane fade in active">
                                    <Form id="input_form" formData={this.state.defaultValues} schema={this.state.schema} onChange={e=>console.log(e.formData)} onSubmit={this.handleSubmit}/>
                                </div>
                                <div id="MD_output" className="tab-pane fade">
                                    <textarea id="readme_out" rows="44" cols="70" value={this.state.readmeOut} onChange={this.handleChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div id="html_out" dangerouslySetInnerHTML={{__html: this.state.subject}}></div>
                        </div>
                    </div>
                </div>


            </div>
        )
    }
}

export default App;