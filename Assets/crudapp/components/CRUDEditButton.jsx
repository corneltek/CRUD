import React from "react";
import CRUDRelModal from "../CRUDRelModal";

/*
<CRUDEditButton 
    label="Edit"
    size="large"
    side=false
    recordKey={3}
    baseUrl=/bs/user
>
</CRUDEditButton>

*/
export default React.createClass({

  propTypes: {
    /**
     * label of the button
     */
    "label": React.PropTypes.string,

    /*
     * the baseUrl of a CRUD handler, usually "/bs"
     */
    "baseUrl": React.PropTypes.string,


    /**
     * The region element
     */
    "region": React.PropTypes.any,

    /**
     * the partial DOM element used for updating.
     */
    "partial": React.PropTypes.any,

    "partialRefresh": React.PropTypes.bool,


    // modal related options
    // ==============================
    /**
     * the modal size: it could be "large", "small"
     */
    "size": React.PropTypes.string,

    /**
     * show the modal as a side modal?
     */
    "side": React.PropTypes.bool,

    /**
     * the title of the modal
     */
    "title": React.PropTypes.string,

    /**
     * The primary key of the record. the reason we didn't use "key" is because react already uses "key" as the component key.
     */
    "recordKey": React.PropTypes.any.isRequired,

    "btnSize": React.PropTypes.string,

    "btnStyle": React.PropTypes.string,

    "onInit": React.PropTypes.func,

    "onSuccess": React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
        "partialRefresh": true,
        "btnStyle": "default"
    };
  },

  getInitialState: function() {
    return {};
  },

  componentDidMount: function() { },

  componentWillUnmount: function() { },

  handleClick: function(e) {

    e.stopPropagation();

    const args = {};

    args.key = this.props.recordKey;

    CRUDRelModal.open(
        this.props.title || this.props.label || 'Untitled',
        this.props.baseUrl + "/crud/edit", args,
        {
            "size": this.props.size || "large",
            "side": this.props.side || false,
            "closeOnSuccess": true,
            "init": this.props.onInit, /* function(e, ui) { */
            "success": (ui, resp) => {
                if (this.props.onSuccess) {
                    this.props.onSuccess(ui, resp);
                }
                if (typeof this.props.partialRefresh === "boolean") {
                    if (this.props.partial) {
                        $(this.props.partial).asRegion().refresh();
                    } else {
                        $(this.button).closest('[data-region]').asRegion().refresh();
                    }
                }
             }
        });
  },

  render: function() {
      let btnClassName = "btn";
      if (this.props.btnStyle) {
          btnClassName += " btn-" + this.props.btnStyle;
      }
      if (this.props.btnSize) {
          btnClassName += " btn-" + this.props.btnSize;
      }

      return (
        <button className={btnClassName} 
            ref={ (button) => { this.button = button; } }
            onClick={this.handleClick}>

            {this.props.label || '編輯'}
        </button>
      );
  }
});
// vim:sw=2:ts=2:sts=2:
