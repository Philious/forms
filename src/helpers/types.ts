import { IconEnum } from "./enum";

export type actionButton = {
  id: string;
  label: string;
  action: () => void;
  keepOpenOnClick?: boolean;
}

export type Option = actionButton & { icon?: IconEnum; }

export type Position = {
  top: number,
  right: number,
  bottom: number,
  left: number,
  width: number,
  height: number
}
