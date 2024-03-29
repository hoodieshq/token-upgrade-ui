## token-upgrade-ui

### Testing

#### Smoke

To run Smoke-tests properly, there should be an active Storybook instance running.

Due to that, `concurrently` is used to run Storybook's instance and test-suite in parallel. The trick here is to "interrupt" active Storybook's instance upon test completion by port number.

```sh
$ pnpm run ci:sb
# launch Storybook on default(6006) port

$ pnpm run ci:test-sb
# unfolding the logic behind the script:
# $ wait-on tcp:6006
# wait for Storybook's instance to start up
# $ pnpm run test-sb
# run test-suite
# $ pnpm run ci:sb-kill
# send an `interrupt` signal to the storybook's instance,
# and this will end the process with 0 code;
#  on the other hand, if a process ends with code 1,
#  it will prevent the execution upon
#  any unwanted error as
#  we utilize `--kill-others-on-fail` option
```
