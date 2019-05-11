import {PureComponent} from 'react'
import reim, {Reim, Filter, Actions, Cache} from 'reim'

export interface StateProps<
  TR extends Reim<any> = Reim<{}>,
  TS extends (TR["_state"] extends (null | undefined) ? any : TR["_state"]) = (TR["_state"] extends (null | undefined) ? any : TR["_state"]),
  TF extends Filter<TS> = (s: TS) => TS,
  TA extends Actions<TS> = Actions<TS>
> {
  children: (
    cache: Cache<TS, TF>,
    actions?: TA
  ) => React.ReactElement<any>;
  store?: TR;
  filter?: TF;
  actions?: Actions<TS>;
  initial?: TS;
  onChange?: (cache: Cache<TS, TF>) => any;
}

export interface StateState<TS, TF> {
  cache: Cache<TS, TF>;
}

class State<
  TR extends Reim<any> = Reim<{}>,
  TS extends (TR["_state"] extends (null | undefined) ? any : TR["_state"]) = (TR["_state"] extends (null | undefined) ? any : TR["_state"]),
  TF extends Filter<TS> = (s: TS) => TS,
  TA extends Actions<TS> = Actions<TS>
> extends PureComponent<StateProps<TR, TS, TF, TA>, StateState<TS, TF>> {
  private _handler: any
  private firstBlood: boolean = true
  store: TR

  state: StateState<TS, TF> = {
    cache: null
  }

  componentDidMount() {
    this.store = this.props.store || reim(this.props.initial) as TR

    this.setFilter()
  }

  componentDidUpdate(prevProps: StateProps<TR, TS, TF, TA>) {
    if (prevProps.initial !== this.props.initial) {
      this.store.reset(this.props.initial)
    }

    // User changed filter functions
    if (prevProps.filter !== this.props.filter) {
      this.setFilter()
    }
  }

  componentWillUnmount() {
    this.store.unsubscribe(this._handler)
  }

  setFilter() {
    if (this._handler) {
      this.store.unsubscribe(this._handler)
    }
    this._handler = cache => {
      this.setState({cache})
      if (!this.firstBlood) {
        this.props.onChange(cache)
      } else {
        this.firstBlood = false
      }
    }

    this.store.subscribe(this._handler, {
      immediate: true,
      filter: this.props.filter
    })
  }

  render() {
    const {children} = this.props
    const {cache} = this.state

    return this.store ? children(cache, this.store.actions(this.props.actions) as TA) : null
  }
}

// @ts-ignore
State.defaultProps = {
  children() {},
  store: null,
  filter: s => s,
  actions: () => {},
  initial: null,
  onChange() {}
}

export default State
