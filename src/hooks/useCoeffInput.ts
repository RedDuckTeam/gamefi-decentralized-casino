import { useCallback, type ChangeEvent } from 'react';

import { maxValueChecker } from '@/lib/max-value-checker';

export type useCoeffInputProps = {
  minCoeff: number;
  maxCoeff: number;
  value: string;
  setValue: (targetCoeff: string) => void;
};

export const useCoeffInput = ({
  value,
  setValue,
  minCoeff,
  maxCoeff,
}: useCoeffInputProps) => {
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (newValue == '') {
        setValue('');
      } else if (newValue === '.' || newValue == '0.') {
        setValue('0.');
      } else if (
        newValue.startsWith('.') ||
        (newValue.startsWith('0') && !newValue.startsWith('0.'))
      ) {
        setValue(String(parseFloat(newValue)));
      } else if (/^\d*\.?\d*$/.test(newValue)) {
        setValue(maxValueChecker(newValue, maxCoeff.toString()));
      }
    },
    [maxCoeff, setValue],
  );

  const handleDecrement = useCallback(() => {
    if (value == '' || parseFloat(value) < minCoeff) {
      return setValue(String(minCoeff));
    }

    let [integerPart, fractionalPart] = value.split('.');

    if (fractionalPart) {
      if (fractionalPart !== '0'.repeat(fractionalPart.length)) {
        const decrementedFractional = (BigInt(fractionalPart) - 1n)
          .toString()
          .padStart(fractionalPart.length, '0');

        fractionalPart = decrementedFractional;
      } else {
        integerPart = (BigInt(integerPart) - 1n).toString();
        fractionalPart = '9'.repeat(fractionalPart.length);
      }
    } else {
      integerPart = (BigInt(integerPart) - 1n).toString();
      fractionalPart = '9';
    }

    if (parseInt(integerPart, 10) < 1) {
      integerPart = '1';
      fractionalPart = fractionalPart ? '0'.repeat(fractionalPart.length) : '';
    }

    setValue(`${integerPart}${fractionalPart ? '.' + fractionalPart : ''}`);
  }, [minCoeff, setValue, value]);

  const handleIncrement = useCallback(() => {
    if (value == '' || parseFloat(value) < minCoeff) {
      return setValue(String(minCoeff));
    }

    let [integerPart, fractionalPart] = value.split('.');

    if (fractionalPart) {
      const fractionalLength = fractionalPart.length;
      let incrementedFractional = (BigInt(fractionalPart) + 1n)
        .toString()
        .padStart(fractionalLength, '0');

      if (incrementedFractional.length > fractionalLength) {
        integerPart = (BigInt(integerPart) + 1n).toString();
        incrementedFractional = incrementedFractional.substring(1);
      }

      fractionalPart = incrementedFractional;
    } else {
      fractionalPart = '1';
    }

    const resultBet =
      integerPart + `${fractionalPart ? '.' + fractionalPart : ''}`;

    setValue(maxValueChecker(resultBet, String(maxCoeff)));
  }, [maxCoeff, minCoeff, setValue, value]);

  return { handleInputChange, handleDecrement, handleIncrement };
};
