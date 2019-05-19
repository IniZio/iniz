import * as React from 'react'
import reim, {Reim, Filter, Actions, Cache} from 'reim'

import context from '../context'

export interface StateProps<
  TR extends Reim<any> = Reim<any>,
  TS extends TR['_state'] extends (null | undefined)
    ? any
    : TR['_state'] = TR['_state'] extends (null | undefined)
    ? any
    : TR['_state'],
  TF extends Filter<TS> = (s: TS) => any,
  TA extends Actions<TS> = Actions<TS>
> {
  children: ((cache: Cache<TS, TF>, actions?: TA) => JSX.Element) | JSX.Element;
  store?: TR;
  filter?: TF;
  actions?: TA;
  initial?: TS;
  onChange?: (cache: Cache<TS, TF>) => any;
}

export interface StateState<TS, TF> {
  cache: Cache<TS, TF>;
}

class State<
  TR extends Reim<any> = Reim<{}>,
  TS extends TR['_state'] extends (null | undefined)
    ? any
    : TR['_state'] = TR['_state'] extends (null | undefined)
    ? any
    : TR['_state'],
  TF extends Filter<TS> = (s: TS) => any,
  TA extends Actions<TS> = Actions<TS>
> extends React.Component<StateProps<TR, TS, TF, TA>, StateState<TS, TF>> {
  store: TR

  state: StateState<TS, TF> = {
    cache: null
  }

  private _handler: any

  private _firstBlood: boolean = true

  componentDidMount() {
    this.store =
      this.props.store || (reim(this.props.initial) as TR) || this.context

    this.setFilter()
  }

  shouldComponentUpdate(nextProps: StateProps<TR, TS, TF, TA>, nextState: StateState<TS, TF>) {
    if (nextProps.filter !== this.props.filter) {
      this.setFilter()
    }

    return (
      nextState !== this.state ||
      nextProps.actions !== this.props.actions
    )
  }

  componentDidUpdate(prevProps: StateProps<TR, TS, TF, TA>) {
    if (prevProps.initial !== this.props.initial) {
      this.store.reset(this.props.initial)
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
      if (this._firstBlood) {
        this._firstBlood = false
      } else {
        this.props.onChange(cache)
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

    return (
      <context.Provider value={this.store}>
        {this.store ?
          typeof children === 'function' ?
            children(cache, this.store.actions(this.props.actions)) :
            children :
          null}
      </context.Provider>
    )
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
