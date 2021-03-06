import React from 'react';
import { Delete, Edit } from '@material-ui/icons';
import {
  WidgetBody,
  Table,
  TableHead,
  TableCell,
  TableActionCell,
  TableBody,
  TableRow,
  IconButton,
} from '../../../ui';
import { getKeyFromText } from '../../../utils/getKeyFromText';
import { TABLE_HEAD } from './constants';
import { ApiDefsListFC } from './types';

const getCellAlign = (idx: number) => (idx === 0 ? 'left' : 'right');

export const ApiDefsList: React.FC<ApiDefsListFC> = ({
  list,
  onDelete,
  onUpdate,
}) => {
  return (
    <>
      <WidgetBody>
        <Table>
          <TableHead>
            {TABLE_HEAD.map((cell, idx) => (
              <TableCell key={getKeyFromText(cell)} align={getCellAlign(idx)}>
                {cell}
              </TableCell>
            ))}
          </TableHead>
          <TableBody>
            {list.map((node, idx) => (
              <TableRow key={`node-${idx}`}>
                {node.map((item: any, indx: any) => (
                  <TableCell
                    key={`node-${idx}-item-${indx}`}
                    align={getCellAlign(indx)}
                  >
                    {item}
                  </TableCell>
                ))}
                <TableActionCell>
                  <IconButton>
                    <Edit onClick={onUpdate(idx)} />
                  </IconButton>
                  <IconButton>
                    <Delete onClick={onDelete(idx)} />
                  </IconButton>
                </TableActionCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </WidgetBody>
    </>
  );
};
