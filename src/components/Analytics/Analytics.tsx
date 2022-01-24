import React from 'react';
import {TouchableWithoutFeedback, TouchableWithoutFeedbackProps} from 'react-native';
import {useAnalytics} from 'utilities/hooks/useAnalytics';

export interface AnalyticsParams {
  [key: string]: any;
}

export interface AnalyticsProps extends TouchableWithoutFeedbackProps {
  name: string;
  params?: AnalyticsParams;
}

export function Analytics(props: AnalyticsProps) {
  const {name, params, ...restProps} = props;

  const {sendEvent} = useAnalytics();

  const handleEvent = async () => {
    await sendEvent(name, params);
  };

  return <TouchableWithoutFeedback onPress={handleEvent} {...restProps} />;
}
