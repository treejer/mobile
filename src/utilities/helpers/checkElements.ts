import React from 'react';

export function isClassComponent(component) {
  return typeof component === 'function' && !!component.prototype.isReactComponent;
}

export function isFunctionComponent(component) {
  return typeof component === 'function' && String(component).includes('return React.createElement');
}

export function isReactComponent(component) {
  return isClassComponent(component) || isFunctionComponent(component);
}

function isElement(element) {
  return React.isValidElement(element);
}

export function isElementOrComponent(element) {
  return isReactComponent(element) || isElement(element);
}
