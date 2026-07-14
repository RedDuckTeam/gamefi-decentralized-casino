import { useContext, useState } from 'react';

import RouletteActionButtons from './actions-buttons';
import RouletteDeskCell from './roulette-desk-cell';
import RouletteDeskCellCross from './roulette-desk-cell-cross';
import RouletteDeskCellDual from './roulette-desk-cell-dual';

import { RouletteContext } from '../shared/roulette-context';

import { numRows, specialSlots } from '@/constants/roulette';
import { redNumbers } from '@/constants/roulette-numbers';
import { type ChipValue } from '@/types/roulette';
import './roulette-desk.css';

export default function RouletteBets({
  selectedChip,
}: {
  selectedChip: ChipValue | null;
}) {
  const [hoveredRange, setHoveredRange] = useState<string[]>([]);

  const { bets, placeBet } = useContext(RouletteContext);

  const handlePlaceBet = (position: string) => {
    placeBet(position, selectedChip);
  };

  const renderDeskCell = (
    className: string,
    variant: 'red' | 'black' | 'zero' | 'custom',
    value: string,
    label: string,
    onClick: () => void,
    key?: string,
  ) => (
    <RouletteDeskCell
      key={key}
      className={className}
      variant={variant}
      value={value}
      label={label}
      chips={bets.get(value) || []}
      hovered={hoveredRange.includes(value.slice(1))}
      onClick={onClick}
      setHoveredRange={setHoveredRange}
      chipSelected={selectedChip !== null}
    />
  );

  const getCellVariant = (numberValue: string) => {
    if (numberValue === '0') return 'zero';
    return redNumbers.includes(numberValue) ? 'red' : 'black';
  };

  const renderNumberCells = () => {
    return numRows.map((row) => {
      return row.split(' ').map((number, index) => {
        const length = number.split('_').length;
        const key = `${number}-${index}`;

        if (number === '.') {
          return <div key={key} />;
        }

        if (length === 2) {
          return (
            <RouletteDeskCellDual
              key={key}
              value={number}
              onClick={() => handlePlaceBet(number)}
              setHoveredRange={setHoveredRange}
              chips={bets.get(number) || []}
            />
          );
        }

        if (length === 3 || length === 4) {
          return (
            <RouletteDeskCellCross
              key={key}
              value={number}
              onClick={() => handlePlaceBet(number)}
              setHoveredRange={setHoveredRange}
              chips={bets.get(number) || []}
            />
          );
        }

        const specialSlotIndex = specialSlots.findIndex(
          (x) => x.label === number,
        );

        if (specialSlotIndex !== -1) {
          return renderDeskCell(
            'flex aspect-square items-center justify-center ' + number,
            number === 'ctop' ? 'red' : 'black',
            number,
            '1:3',
            () => handlePlaceBet(number),
            key,
          );
        }

        const numberValue = number.slice(1);
        return renderDeskCell(
          `flex items-center justify-center ${number}`,
          getCellVariant(numberValue),
          number,
          numberValue,
          () => handlePlaceBet(number),
          key,
        );
      });
    });
  };

  return (
    <div className="z-10 flex flex-col gap-8 rounded-[18px] p-8 pt-0">
      <RouletteActionButtons />
      <div className="grid grid-cols-[repeat(14,52px)] justify-center gap-1">
        <div />
        {renderDeskCell('col-span-6', 'custom', 'c1-18', '1 to 18', () =>
          handlePlaceBet('c1-18'),
        )}
        {renderDeskCell('col-span-6', 'custom', 'c19-36', '19 to 36', () =>
          handlePlaceBet('c19-36'),
        )}
        <div />

        <div className="numbers-grid">{renderNumberCells()}</div>

        <div />
        {renderDeskCell('col-span-4', 'custom', 'c1-12', '1 to 12', () =>
          handlePlaceBet('c1-12'),
        )}
        {renderDeskCell('col-span-4', 'custom', 'c13-24', '13 to 24', () =>
          handlePlaceBet('c13-24'),
        )}
        {renderDeskCell('col-span-4', 'custom', 'c25-36', '25 to 36', () =>
          handlePlaceBet('c25-36'),
        )}
        <div />

        <div />
        {renderDeskCell('col-span-3', 'custom', 'even', 'EVEN', () =>
          handlePlaceBet('even'),
        )}
        {renderDeskCell('col-span-3', 'red', 'red', `\t`, () =>
          handlePlaceBet('red'),
        )}
        {renderDeskCell('col-span-3', 'black', 'black', `\t`, () =>
          handlePlaceBet('black'),
        )}
        {renderDeskCell('col-span-3', 'custom', 'odd', 'ODD', () =>
          handlePlaceBet('odd'),
        )}
        <div />
      </div>
    </div>
  );
}
