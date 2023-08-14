import React from 'react';

export type RenderIfProps = {
  condition: boolean;
  children: JSX.Element | JSX.Element[];
};

export function RenderIf(props: RenderIfProps) {
  const {children, condition} = props;

  return condition ? <>{children}</> : null;
}
