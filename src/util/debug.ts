import { debug } from 'debug'
import { red, green, blue, yellow } from 'chalk'

const NAMESPACE = 'stencil-tw'

export default {
  time: debug(`${NAMESPACE}:t`),
  log: debug(NAMESPACE),
  red: (...args: any[]) => debug(NAMESPACE)(red(args)),
  green: (...args: any[]) => debug(NAMESPACE)(green(args)),
  blue: (...args: any[]) =>  debug(NAMESPACE)(blue(args)),
  yellow: (...args: any[]) => debug(NAMESPACE)(yellow(args))
}
