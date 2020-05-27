import { debug as _debug } from 'debug';
import { red, green, blue, yellow } from 'chalk'

const NAMESPACE = 'stencil-tw'

export default {
  time: _debug(`${NAMESPACE}:t`),
  log: _debug(NAMESPACE),
  red: (s: any) => _debug(NAMESPACE)(red(s)),
  green: (s: any) => _debug(NAMESPACE)(green(s)),
  blue: (s: any) =>  _debug(NAMESPACE)(blue(s)),
  yellow: (s: any) => _debug(NAMESPACE)(yellow(s))
}
