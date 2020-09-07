import * as React from 'react';
export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current && navigationRef.current.navigate(name, params);
}

export function dispatch(name, params) {
  navigationRef.current && navigationRef.current.replace(name, params);
}

export function goBack() {
  navigationRef.current && navigationRef.current.goBack();
}
