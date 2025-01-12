export type WidgetProps = {
  callbackRoute: string;
};

export type WidgetType<T = any> = {
  title: string;
  widget: (referrer:string, { callbackRoute }: WidgetProps) => JSX.Element;
  description?: string;
  props?: { referrer: string };
  reference: string;
  anchor?: string;
};
