import React, { Component } from "react";
import File from "./File";

class Editor extends Component {
  constructor() {
    super();

    this.state = {
      description: "",
      public: true,
      files: [{ index: 0, filename: "", content: "" }],
      isSubmit: false,
      isSetGist: false
    };
  }

  componentDidMount() {
    if (this.isEdit()) {
      this.setGist();
    }
  }

  componentWillReceiveProps() {
    if (!this.state.isSetGist && this.isEdit()) {
      this.setGist();
    }
  }

  isEdit() {
    return this.props.type == "edit";
  }

  setGist() {
    const {
      gist,
      match: {
        params: { id }
      }
    } = this.props;
    const currentGist = gist[id];

    if (currentGist) {
      this.setState({ ...currentGist, isSetGist: true });
    }
  }

  handleChange(keyValue) {
    this.setState(keyValue);
  }

  handleFileChange(keyValue, index) {
    const { files } = this.state;
    const value = { ...this.state.files[index], ...keyValue };
    let newFiles = files.concat();
    newFiles[index] = value;

    this.setState({ files: newFiles });
  }

  addFile() {
    const { files } = this.state;
    const newFile = { index: files.length, filename: "", content: "" };
    const newFiles = this.state.files.concat(newFile);
    this.setState({ files: newFiles });
  }

  handleSubmit() {
    if (!this.state.isSubmit) {
      const { type } = this.props;
      const {
        actions: { submitGist }
      } = this.props;
      submitGist({ data: this.state, type: type });
      this.setState({ isSubmit: true });
    }
  }

  fileEditors() {
    const fileEditorList = this.state.files.map(f => {
      return (
        <li key={f.index}>
          <File
            {...f}
            onChange={keyValue => this.handleFileChange(keyValue, f.index)}
          />
        </li>
      );
    });
    return fileEditorList;
  }

  render() {
    const { description } = this.state;
    const { type } = this.props;
    const buttonMessage = type == "create" ? "Create" : "Edit";
    return (
      <div>
        <input
          type="text"
          value={description}
          placeholder="description"
          onChange={e => this.handleChange({ description: e.target.value })}
        />
        <ul>{this.fileEditors()}</ul>
        <button onClick={() => this.addFile()}>Add File</button>
        <button onClick={() => this.handleSubmit()}>{buttonMessage}</button>
      </div>
    );
  }
}

export default Editor;
