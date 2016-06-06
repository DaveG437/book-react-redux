export default initialDispatch => Connector => class extends Connector {
  componentWillMount() {
    if (super.componentDidMount) super.componentDidMount();
    initialDispatch(this.store.dispatch, this.props, null, this.state.storeState);
  }
  componentWillReceiveProps(nextProps) {
    if (super.componentWillReceiveProps) super.componentWillReceiveProps(nextProps);
    initialDispatch(this.store.dispatch, nextProps, this.props, this.state.storeState);
  }
};
