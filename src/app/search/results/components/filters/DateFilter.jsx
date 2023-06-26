/**
 * The implementation here is adapted from chakra-dayzed-datepicker
 * (https://github.com/aboveyunhai/chakra-dayzed-datepicker/blob/main/src/range.tsx),
 * using a button as the popover trigger instead of the input.
 */

import { useState } from 'react';
import T from 'prop-types';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  useDisclosure
} from '@chakra-ui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';

import { RangeCalendarPanel, Month_Names_Short, Weekday_Names_Short } from 'chakra-dayzed-datepicker';

const calendarConfigs = {
  dateFormat: 'MM/dd/yyyy',
  monthNames: Month_Names_Short,
  dayNames: Weekday_Names_Short,
  firstDayOfWeek: 0,
};

export default function DateFilter({selectedDates, setSelectedDates}) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [dateInView, setDateInView] = useState(selectedDates[0] || new Date());

  const onPopoverClose = () => {
    onClose();
    setDateInView(selectedDates[0] || new Date());
  };

  const setDates = (dates) => {
    setSelectedDates(dates.map(d => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))));
  };

  const handleOnDateSelected = ({ selectable, date }) => {
    if (!selectable) {
      return;
    }
    let newDates = [...selectedDates];
    if (selectedDates.length) {
      if (selectedDates.length === 1) {
        let firstTime = selectedDates[0];
        if (firstTime < date) {
          newDates.push(date);
        } else {
          newDates.unshift(date);
        }
        setDates(newDates);

        onClose();
        return;
      }

      if (newDates.length === 2) {
        setDates([date]);
        return;
      }
    } else {
      newDates.push(date);
      setDates(newDates);
    }
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onPopoverClose}
      placement="bottom-start"
      variant="datepicker"
    >
      <PopoverTrigger>
        <Button size="sm" variant="outline" rightIcon={<MdKeyboardArrowDown />}>Date</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverBody>
            <RangeCalendarPanel
              dayzedHookProps={{
                onDateSelected: handleOnDateSelected,
                selected: selectedDates,
                monthsToDisplay: 2,
                date: dateInView,
                firstDayOfWeek: calendarConfigs.firstDayOfWeek,
              }}
              configs={calendarConfigs}
              selected={selectedDates}
            />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

DateFilter.propTypes = {
  selectedDates: T.array.isRequired,
  setSelectedDates: T.func.isRequired
};
