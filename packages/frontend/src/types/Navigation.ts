import React from 'react';

import { Roles } from '../model/providers/Auth/constants';

export type GroupItem = {
  text: string;
  link: string;
  roles: Roles[];
  Icon: React.JSXElementConstructor<{}>;
  external?: boolean;
};

export type Group = {
  name?: string;
  items: GroupItem[];
};
