import React, { Component } from "react";
import File from "./File";
import { If } from "../../parts/If";
import Loader from "../../parts/Loader";
import Dropzone from "react-dropzone";

const overlayStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  padding: "2.5em 0",
  background: "rgba(0,0,0,0.5)",
  textAlign: "center",
  color: "#fff"
};

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      dropzoneActive: false
    };

    props.actions.loading();
  }

  componentDidMount() {
    const {
      type,
      actions: { initEditor },
      match: {
        params: { id }
      }
    } = this.props;
    initEditor({ type: type, id: id });
  }

  isEdit() {
    return this.props.type == "edit";
  }

  isValid() {
    const {
      editor: { files }
    } = this.props;
    return files.every(
      e => e.filename && e.content && e.filename.indexOf("/") == -1
    );
  }

  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  onDrop(files) {
    files.forEach(file => {
      if (file.size < 10000) {
        this.parseFile(file);
      }
    });

    this.setState({
      dropzoneActive: false
    });
  }

  handleUploadFile(e) {
    const file = e.target.files[0]; // なぜかforEachが効かない
    this.parseFile(file);
  }

  parseFile(file) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => {
      const content = e.target.result;
      this.addFile(file.name, content);
    };
  }

  handleChange(keyValue) {
    const {
      actions: { handleEditorChange },
      type,
      match: {
        params: { id }
      }
    } = this.props;
    handleEditorChange({ keyValue, type, id });
  }

  handleFileChange(keyValue, index) {
    const {
      editor: { files }
    } = this.props;
    const value = { ...files[index], ...keyValue };
    let newFiles = files.concat();
    newFiles[index] = value;

    this.handleChange({ files: newFiles });
  }

  addFile(filename = "", content = "") {
    const {
      editor: { files }
    } = this.props;
    const newFile = {
      index: files.length,
      filename: filename,
      content: content
    };
    const newFiles = files.concat(newFile);
    this.handleChange({ files: newFiles });
  }

  deleteFile(index) {
    const {
      editor: { files }
    } = this.props;
    const newFiles = files
      .filter(f => f.index != index)
      .map((f, i) => ({ ...f, index: i }));
    this.handleChange({ files: newFiles });
  }

  handleSubmit() {
    const {
      actions: { submitGist }
    } = this.props;
    const method = this.isEdit() ? "PATCH" : "POST";
    if (this.isValid()) submitGist({ data: this.state, method: method });
  }

  fileEditors() {
    const {
      editor: { files }
    } = this.props;
    const isDeletable = files.length > 1;
    const fileEditorList = files.map(f => {
      return (
        <li key={f.index}>
          <File
            {...f}
            isDeletable={isDeletable}
            onChange={keyValue => this.handleFileChange(keyValue, f.index)}
            deleteFile={() => this.deleteFile(f.index)}
          />
        </li>
      );
    });
    return fileEditorList;
  }

  render() {
    const {
      editor: { description },
      load: { isLoading },
      actions: { deleteGist },
      match: { params }
    } = this.props;

    const buttonMessage = this.isEdit() ? "Edit" : "Create";
    const loadMessage = this.isEdit() ? "Updating..." : "Creating...";

    return (
      <div>
        <Loader message={loadMessage} />
        <Dropzone
          disableClick
          accept="text/*"
          style={{ position: "relative" }}
          onDrop={files => this.onDrop(files)}
          onDragEnter={() => this.onDragEnter()}
          onDragLeave={() => this.onDragLeave()}
        >
          {this.state.dropzoneActive && (
            <div style={overlayStyle}>Drop files...</div>
          )}
          <If condition={!isLoading}>
            <div className="m-editor">
              <div className="description">
                <input
                  type="text"
                  value={description}
                  placeholder="description"
                  name="description"
                  onChange={e =>
                    this.handleChange({ description: e.target.value })
                  }
                />
              </div>
              <ul>{this.fileEditors()}</ul>
              <div className="button-zone">
                <If condition={this.isEdit()}>
                  <button
                    className="p-button red"
                    onClick={() => deleteGist({ id: params.id })}
                  >
                    <span>Delete Gist</span>
                  </button>
                </If>
                <button className="p-button">
                  <label htmlFor="file">
                    <span>Upload File</span>
                    <input
                      type="file"
                      id="file"
                      onChange={e => this.handleUploadFile(e)}
                    />
                  </label>
                </button>
                <button className="p-button" onClick={() => this.addFile()}>
                  <span>Add File</span>
                </button>
                <button
                  className={this.isValid() ? "p-button" : "p-button invalid"}
                  onClick={() => this.handleSubmit()}
                >
                  <span>{buttonMessage}</span>
                </button>
              </div>
            </div>
          </If>
        </Dropzone>
      </div>
    );
  }
}

export default Editor;
