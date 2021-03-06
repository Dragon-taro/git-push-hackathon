import React, { Component } from "react";
import { Link } from "react-router-dom";
import Loader from "../parts/Loader";
import { If } from "../parts/If";
import File from "./File";
import hljs from "highlight.js";
import marked from "marked";

class Gist extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const { gist, id } = this.getGist();

    if (!gist) {
      this.props.actions.getOneGist({ id: id });
    }
  }

  componentDidUpdate() {
    hljs.initHighlightingOnLoad();
    marked.setOptions({
      highlight: function(code, lang) {
        return hljs.highlightAuto(code, [lang]).value;
      }
    });
  }

  getGist() {
    const {
      params: { id }
    } = this.props.match;
    const gist = this.props.gist[id] || false;
    return { id, gist };
  }

  fileList() {
    const { gist } = this.getGist();

    if (gist.files)
      return gist.files.map(f => <File file={f} key={f.filename} />);
  }

  render() {
    const { gist, id } = this.getGist();

    return (
      <div className="m-gist">
        <Loader />
        <If condition={gist}>
          <div>
            <div className="description-zone">
              <div className="description">{gist.description}</div>
              <div className="button">
                <button className="p-button">
                  <Link to={`/gists/${id}/edit`}>Edit Gist</Link>
                </button>
              </div>
            </div>
            <ul>{this.fileList()}</ul>
          </div>
        </If>
      </div>
    );
  }
}

export default Gist;
