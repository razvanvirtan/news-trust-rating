import { getCallbackRoute } from 'utils/getCallbackRoute';
import { WidgetType } from 'types/widget.types';
import { useIsWebProvider } from 'hooks';

export const Widget = ({
  title,
  description,
  reference,
  anchor,
  widget: MxWidget,
  props = {}
}: WidgetType) => {
  const { isWebProvider } = useIsWebProvider();
  const callbackRoute = anchor
    ? getCallbackRoute({ anchor, isWebProvider })
    : '';

  return (
      <MxWidget callbackRoute={callbackRoute} {...props} />
  );
};
