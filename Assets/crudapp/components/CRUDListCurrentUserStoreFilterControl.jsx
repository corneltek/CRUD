
var React = require('react');

export default React.createClass({

  propTypes: {
    "org_id": React.PropTypes.number,
    "context": React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return { "stores": [] };
  },

  componentDidMount: function() {
    var that = this;

    // fetch all current user stores
    $.getJSON("/=/current_user_store", function(stores) {
      if (that.isMounted()) {
        that.setState({ "stores": stores });
        that.props.context.filterStore.addChangeListener(that.handleFilterChange);
      }
    });
  },

  componentWillUnmount: function() {
    this.props.context.filterStore.removeChangeListener(this.handleFilterChange);
  },

  handleFilterChange: function(e) {
    var that = this;
    $.getJSON("/=/current_user_store", {
      "org_id": that.props.context.filterStore.args.org_id
    }, function(stores) {
      if (that.isMounted()) {
        that.setState({ "stores": stores });
      }
    });
  },

  handleChange: function(e) {
    this.props.context.actionCreators.applyFilter("store_id", e.target.value);
  },

  render: function() {
    var options = [];
    var that = this;

    options.push(<option key={0} value={0}>選擇店家</option>);

    if (this.state.stores) {
      this.state.stores.map(function(item) {
        options.push(<option key={"store-" + item["id"]} value={item["id"]}>{item["name"] + " (" + item["code"] + ")"}</option>);
      });
    }
    return (
      <select className="form-control" onChange={this.handleChange}>
        {options}
      </select>
    );
  }
});
