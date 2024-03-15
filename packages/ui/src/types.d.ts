type PropsWithTestId<T> = T & { ["data-testid"]: string }

type ComponentPropsWithTestId<C> = PropsWithTestId<React.ComponentProps<C>>
