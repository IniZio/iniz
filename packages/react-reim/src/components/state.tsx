import {PureComponent} from 'react'
import reim, {Store, Getter, Mutation} from 'reim'

export interface StateProps extends React.Props<State> {
  children?: (cache: any, store: Store) => React.ReactElement<any> | React.ReactElement<any>;
  store?: Store;
  getter?: Getter;
  setter?: Mutation;
  initial?: object;
  onChange?: (cache: any) => any;
}

export interface StateState {
  isInitialized: boolean;
  getterCache: object;
  setterCache: object;
}

class State extends PureComponent<StateProps, StateState> {
  private _handler: any

  store: Store

  state = {
    isInitialized: false,
    getterCache: {},
    setterCache: {}
  }

  componentDidMount() {
    this.store = this.props.store || reim(this.props.initial || {})

    this.setGetter()
    this.setSetter()
  }

  componentDidUpdate(prevProps: StateProps) {
    if (!this.props.store && prevProps.initial !== this.props.initial) {
      this.store.reset(this.props.initial)
    }

    // User changed getter / setter functions
    if (prevProps.getter !== this.props.getter) {
      this.setGetter()
    }
    if (prevProps.setter !== this.props.setter) {
      this.setSetter()
    }
  }

  componentWillUnmount() {
    this.store.unsubscribe(this._handler)
  }

  setGetter() {
    if (this._handler) {
      this.store.unsubscribe(this._handler)
    }
    this._handler = this.store.subscribe(getterCache => {
      this.setState({getterCache})
      if (this.state.isInitialized) {
        this.props.onChange(getterCache)
      }
      this.setState({isInitialized: true})
    }, {
      immediate: true,
      getter: this.props.getter
    })
  }

  setSetter() {
    const setters = [].concat(this.props.setter)
      .reduce((acc, val) => ({
        ...acc,
        ...(typeof val === 'function' ? val(this.store) : val)
      }), {})

    this.setState({
      setterCache: Object.keys(setters)
        .reduce((acc: object, k: string) => ({
          ...acc,
          [k]: (...args) => {
            const v = setters[k](...args)
            if (typeof v === 'function') {
              try {
                this.store.set(v)
              } catch (e) {
                return v
              }
            }
            return v
          }
        }), {})
    })
  }

  render() {
    const {children} = this.props
    const {getterCache, setterCache, isInitialized} = this.state

    if (!isInitialized) {
      return null
    }

    return (typeof children === 'function' ? children({...setterCache, ...getterCache}, this.store) : (children || getterCache))
  }
}

// @ts-ignore
State.defaultProps = {
  children: null,
  store: null,
  getter: (s: State) => s,
  setter: () => {},
  initial: null,
  onChange() {}
}

export default State
